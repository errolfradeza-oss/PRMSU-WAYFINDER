const scenes = {
    // CCIT
    "ccit_entrance": {
        "title": "CCIT 1st Floor Entrance",
        "type": "equirectangular",
        "panorama": "images/1st_floor_entrance.jpg",
        "hotSpots": [
            {
                "pitch": -5,
                "yaw": 10,
                "type": "scene",
                "text": "Walk Forward",
                "sceneId": "ccit_step2"
            }
        ]
    },

    "ccit_step2": {
        "title": "CCIT 1st Floor - Step 2",
        "type": "equirectangular",
        "panorama": "images/1st_floor_step2.jpg",
        "hotSpots": [
            {
                "pitch": -5,
                "yaw": 180,
                "type": "scene",
                "text": "Go Back",
                "sceneId": "ccit_entrance"
            },
            {
                "pitch": -5,
                "yaw": 10,
                "type": "scene",
                "text": "CCIT 1st Floor hallway",
                "sceneId": "ccit_step3"
            }
        ]
    },

    "ccit_step3": {
        "title": "CCIT 1st Floor - Step 3",
        "type": "equirectangular",
        "panorama": "images/PANO_20260307_165801.jpg",
        "hotSpots": [
            {
                "pitch": -5,
                "yaw": 90,
                "type": "scene",
                "text": "CCIT 1st Floor restrooms",
                "sceneId": "ccit_step4"
            },
            {
                "pitch": -5,
                "yaw": -90,
                "type": "scene",
                "text": "CCIT 1st Floor Staircase",
                "sceneId": "ccit_step5"
            },
            
            
        ]
    },

     "ccit_step4": {
        "title": "CCIT 1st Floor - Step 4",
        "type": "equirectangular",
        "panorama": "images/PANO_20260307_170010.jpg",
        "hotSpots": [
            {
                "pitch": -5,
                "yaw": 180,
                "type": "scene",
                "text": "CCIT 1st Floor Hallway",
                "sceneId": "ccit_step3"
            }
        ]
    },

    // Nursing
    "nursing_entrance": {
        "title": "Nursing 1st Floor Entrance",
        "type": "equirectangular",
        "panorama": "images/leftside_nursing_near_stairs.jpg"
    }
};

// get scene from URL dynamically
const params = new URLSearchParams(window.location.search);
let startScene = params.get("scene");

// fallback if missing or invalid
if (!startScene || !scenes[startScene]) {
    startScene = "ccit_entrance";
}

// initialize viewer once
const viewer = pannellum.viewer('panorama', {
    "default": {
        "firstScene": startScene,
        "autoLoad": true,
        "hotSpotDebug": true
    },
    "scenes": scenes
});

window.jumpToScene = function(sceneId, buttonElement) {
    if (!scenes[sceneId]) return;

    viewer.loadScene(sceneId);

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');
};

window.addEventListener("resize", () => {
    if (window.viewer?.resize) {
        window.viewer.resize();
    }
});