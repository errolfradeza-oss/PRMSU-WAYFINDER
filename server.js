const express = require("express");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { Server } = require("socket.io");

console.log("✅ server.js starting...");

const app = express();

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "Wayfinder.html"));
});
app.get("/ping", (req, res) => res.type("text").send("PONG OK"));

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, "sslcert", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "sslcert", "cert.pem")),
};

const server = https.createServer(sslOptions, app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// socket.id -> user
const presence = new Map();

function getActiveUsers() {
  const now = Date.now();
  const STALE_MS = 15000;

  for (const [socketId, user] of presence.entries()) {
    if (!user || now - (user.lastSeen || 0) > STALE_MS) {
      presence.delete(socketId);
    }
  }

  return Array.from(presence.values()).filter(u =>
    u.insideCampus === true &&
    typeof u.lat === "number" &&
    typeof u.lng === "number"
  );
}

function emitPresence() {
  io.emit("presence:update", getActiveUsers());
}

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("presence:join", (user) => {
    presence.set(socket.id, {
      id: String(user?.id || socket.id),
      name: String(user?.name || "Guest").slice(0, 24),
      lat: null,
      lng: null,
      acc: null,
      insideCampus: false,
      lastSeen: Date.now()
    });

    emitPresence();
  });

  socket.on("presence:heartbeat", (user) => {
    const prev = presence.get(socket.id) || {};

    presence.set(socket.id, {
      ...prev,
      id: String(user?.id || prev.id || socket.id),
      name: String(user?.name || prev.name || "Guest").slice(0, 24),
      lat: Number(user?.lat),
      lng: Number(user?.lng),
      acc: user?.acc ?? null,
      insideCampus: Boolean(user?.insideCampus),
      lastSeen: Date.now()
    });

    emitPresence();
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
    presence.delete(socket.id);
    emitPresence();
  });
});

setInterval(() => {
  emitPresence();
}, 5000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ HTTPS Server running:
  - https://localhost:${PORT}
  - https://<your-laptop-ip>:${PORT}`);
});