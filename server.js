const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/ping", (req, res) => {
  res.type("text").send("PONG OK");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://errolfradeza-oss.github.io",
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ],
    methods: ["GET", "POST"]
  }
});

const presence = new Map();
const STALE_MS = 15000;

function normalizeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function normalizeBoolean(value) {
  return value === true || value === "true" || value === 1 || value === "1";
}

function pruneStaleUsers() {
  const now = Date.now();

  for (const [socketId, user] of presence.entries()) {
    if (!user || now - (user.lastSeen || 0) > STALE_MS) {
      presence.delete(socketId);
    }
  }
}

function getActiveUsers() {
  pruneStaleUsers();

  // TEMP TEST: removed insideCampus filter for easier debugging
  return Array.from(presence.values()).filter((user) => {
    return (
      typeof user.lat === "number" &&
      Number.isFinite(user.lat) &&
      typeof user.lng === "number" &&
      Number.isFinite(user.lng)
    );
  });
}

function emitPresence() {
  const users = getActiveUsers();
  console.log("📡 Broadcasting presence:update:", users);
  io.emit("presence:update", users);
}

function buildUserPayload(socket, user, prev = {}) {
  const lat = normalizeNumber(user?.lat);
  const lng = normalizeNumber(user?.lng);
  const acc = normalizeNumber(user?.acc);

  return {
    id: String(user?.id || prev.id || socket.id),
    name: String(user?.name || prev.name || "Guest").slice(0, 24),
    lat,
    lng,
    acc,
    insideCampus: normalizeBoolean(user?.insideCampus),
    lastSeen: Date.now()
  };
}

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("presence:join", (user) => {
    const joinedUser = {
      id: String(user?.id || socket.id),
      name: String(user?.name || "Guest").slice(0, 24),
      lat: null,
      lng: null,
      acc: null,
      insideCampus: false,
      lastSeen: Date.now()
    };

    presence.set(socket.id, joinedUser);
    console.log("👤 User joined:", joinedUser);
    emitPresence();
  });

  socket.on("presence:heartbeat", (user) => {
    const prev = presence.get(socket.id) || {};
    const updatedUser = buildUserPayload(socket, user, prev);

    presence.set(socket.id, updatedUser);

    console.log("💓 Heartbeat received:", updatedUser);
    emitPresence();
  });

  socket.on("presence:leave", () => {
    console.log("👋 User left:", socket.id);
    presence.delete(socket.id);
    emitPresence();
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, "| reason:", reason);
    presence.delete(socket.id);
    emitPresence();
  });
});

setInterval(() => {
  emitPresence();
}, 5000);

const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});