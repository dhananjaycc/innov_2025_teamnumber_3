// Setup Scene, Camera, and Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 5);
let prevCameraPosition = new THREE.Vector3();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 2. Define the layout bounds for the camera (e.g., within a box of [-50, 50] for x, y, and z)
const bounds = {
    minX: -20, maxX: 20, // Camera bounds along X axis
    minY: 0, maxY: 10,  // Camera bounds along Y axis (height)
    minZ: -20, maxZ: 20,  // Camera bounds along Z axis

    wallsOuterMaxX: 10, wallsInnerMaxX: 9,
    wallsOuterMaxZ: 10, wallsInnerMaxZ: 9,
    wallsOuterMinX: -10, wallsInnerMinX: -9,
    wallsOuterMinZ: -20, wallsInnerMinZ: -9,
};

function updateCameraPosition() {
    // Ensure the camera stays within the defined bounds
    if (camera.position.x < bounds.minX) {
        camera.position.x = bounds.minX;
    } else if (camera.position.x > bounds.maxX) {
        camera.position.x = bounds.maxX;
    }

    if (camera.position.y < bounds.minY) {
        camera.position.y = bounds.minY;
    } else if (camera.position.y > bounds.maxY) {
        camera.position.y = bounds.maxY;
    }

    if (camera.position.z < bounds.minZ) {
        camera.position.z = bounds.minZ;
    } else if (camera.position.z > bounds.maxZ) {
        camera.position.z = bounds.maxZ;
    }

    // walls
    if (prevCameraPosition.x < bounds.wallsOuterMinX && camera.position.x >= bounds.wallsOuterMinX) {
        camera.position.x = bounds.wallsOuterMinX;
    }
}

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 10, 10);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040));
scene.add(new THREE.AmbientLight(0x404040));

function toggleNightMode() {
    light.intensity = !light.intensity;
}

// Night Toggle
document.querySelector("#night-btn").addEventListener("click", toggleNightMode);

const textureLoader = new THREE.TextureLoader();

// Load Grass Ground (Infinite Effect)
const grassTexture = textureLoader.load('textures/grass.jpg');
grassTexture.wrapS = THREE.RepeatWrapping;
grassTexture.wrapT = THREE.RepeatWrapping;
grassTexture.repeat.set(60, 60);

const groundMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });
const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// 5. Create small patches of grass (use PlaneGeometry for each patch)
const grassPatchTexture = textureLoader.load('textures/grass-patch.png');
const grassPatchGeometry = new THREE.PlaneGeometry(0.6, 0.6); // Small grass patch size
const grassPatchMaterial = new THREE.MeshBasicMaterial({
    map: grassPatchTexture,
    side: THREE.DoubleSide,
    transparent: true
});

// function addGrassPatches(numPatches) {
//     for (let i = 0; i < numPatches; i++) {
//         // Random position on the ground (within 100x100 units)
//         const x = Math.random() * 40 - 20; // Position range [-50, 50]
//         const z = Math.random() * 40 - 20; // Position range [-50, 50]

//         // Create the grass patch mesh
//         const grassPatch = new THREE.Mesh(grassPatchGeometry, grassPatchMaterial);

//         // Position the grass patch
//         grassPatch.position.set(x, 0.1, z); // Small elevation to place it slightly above the ground

//         // Optional: Random rotation for more natural appearance
//         grassPatch.rotation.y = Math.random() * Math.PI;

//         // Add the patch to the scene
//         scene.add(grassPatch);
//     }
// }

// // Add 500 grass patches randomly across the ground
// addGrassPatches(100);

// Function to add multiple grass patches efficiently
function addGrassPatches(scene, count = 100) {
    // Create a single plane geometry for grass
    const geometry = new THREE.PlaneGeometry(0.5, 0.5); // Small grass patches
    const material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('textures/grass.png'), // Grass texture
        transparent: true, // Transparent edges
        side: THREE.DoubleSide
    });

    // Use InstancedMesh for efficient rendering
    const grassMesh = new THREE.InstancedMesh(geometry, material, count);

    // Matrix for transformations
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
        // Random position in the garden area
        const x = (Math.random() - 0.5) * 10; // Spread across 10x10 area
        const z = (Math.random() - 0.5) * 10;

        // Apply transformation to the dummy object
        dummy.position.set(x, 0.01, z); // Slightly above ground
        dummy.rotation.y = Math.random() * Math.PI; // Random rotation
        dummy.updateMatrix();

        // Set transformation for each instance
        grassMesh.setMatrixAt(i, dummy.matrix);
    }

    scene.add(grassMesh); // Add to the scene
}

// Call function inside your scene setup
addGrassPatches(scene);



// Load Skybox
const skyTexture = textureLoader.load('textures/sky.jpg');
scene.background = skyTexture;

const models = [];

const modelSettings = [
    {
        path: 'models/basil.glb',
        position: {
            x: -5,
            y: 0.15,
            z: -5
        },
        scale: 1.2,
        rotation: {
            x: 0,
            y: -Math.PI / 4,
            z: Math.PI / 180 * 2
        },
    },
    {
        path: 'models/aloe.glb',
        position: {
            x: 5,
            y: 0.65,
            z: -5
        },
        scale: 1.2,
    },
    {
        path: 'models/mint.glb',
        position: {
            x: 5,
            y: 0.45,
            z: -10
        },
        scale: 1.2
    },
    {
        path: 'models/chamomile.glb',
        position: {
            x: -5,
            y: 0.55,
            z: -10
        },
        scale: 2.2
    },
    {
        path: 'models/echinacea.glb',
    position: {
        x: 0,
        y: 0,
        z: -12
    },
    scale: 2.2,
    rotation: {
        x: Math.PI / 2,  // Rotate horizontally
        y: -Math.PI / 2, // Keep Y rotation as needed
        z: 0
    }
    },
    {
        path: 'models/ginko-biloba.glb', 
        position: {
            x: -5,
            y: 0.5,
            z: -7
        },
        scale: 2.2
    },
    {
        path: 'models/gudchi.glb',
        position: {
            x: -5,
            y: 0.5,
            z: -3
        },
        scale: 2.2
    },
    {
        path: 'models/opuntia-cochenillifera.glb', 
        position: {
            x: 5,
            y: 0.5,
            z: -7
        },
        scale: 2.2,
        rotation: {
            x: 0,
            y: Math.PI,
            z: 0
        }
    },
   
]

// Load 3D Models
const gltfLoader = new THREE.GLTFLoader();
const objLoader = new THREE.OBJLoader();

modelSettings.forEach(model => {
    loadPlant(model.path, model.position, model.scale, model.rotation);
});

function loadPlant(modelPath, position, scale = 0.025, rotation = { x: 0, y: 0, z: 0}) {
    const extension = modelPath.split('.').pop().toLowerCase();

    if (extension === "gltf" || extension === "glb") {
        gltfLoader.load(modelPath, function (gltf) {
            let plant = gltf.scene;
            plant.position.set(position.x, position.y, position.z);
            plant.scale.set(scale, scale, scale); // Reduce model size
            plant.traverse(function (child) {
                if (child.isMesh) {
                    if (child.isLight) {
                        child.intensity = 30; // Increase light intensity
                    }
                }
            });
            rotatePlant(plant, rotation);
            scene.add(plant);

            models.push(plant);
        }, undefined, function (error) {
                console.error(error);
        });
    }
    // NOTE: OBJLoader
    // } else if (extension === "obj") {
    //     objLoader.load(modelPath, function (obj) {
    //         obj.position.set(position.x, position.y, position.z);
    //         obj.scale.set(scale, scale, scale); // Reduce model size
    //         logModel(obj);
    //         colorModel(obj, colors);
    //         scene.add(obj);
    //     });
    // }
}

function rotatePlant(model, rotation) {
    if (rotation) {
        if (rotation.x)
            model.rotation.x += rotation.x;
        if (rotation.y)
            model.rotation.y += rotation.y;
        if (rotation.z)
            model.rotation.z += rotation.z;
    }
}

// function logModel(model) {
//     model.traverse(function (child) {
//         if (child.isMesh) {
//             console.log("Part name:", child.name);
//             console.log("Material used:", child.material);
//         }
//     });
// }

// function colorModel(model, partColors) {
//     model.traverse(function (child) {
//         if (child.isMesh && child.material) {
//             let partName = child.name;
//             if (partColors[partName] !== undefined) {
//                 if (Array.isArray(child.material)) {
//                     child.material.forEach(function(material) {
//                         if (material.color) {
//                             material.color.set(partColors[partName]);  // Set the color for each material
//                         }
//                     });
//                 }
//                 else {
//                     if (child.material.color) {
//                         child.material.color.set(partColors[partName]);
//                     }
//                 }
//             } else {
//                 if (child.material.color) {
//                     child.material.color.set(0xff0000);
//                 }
//             }
//         }
//     });
// }

// Adding 3D Plants
// loadPlant('models/aloe.obj', { x: 5, y: 1, z: -5 }, { Group4: 0x258b43 });
// loadPlant('models/lemon-grass.obj', { x: 5, y: 1, z: -5 }, { matte_black: 0xaa00ff, grass_blades: 0x77ff00 }, 0.2);
// loadPlant('models/basil.glb', { x: -5, y: 0.15, z: -5 }, 1.2, { x: 0, y: -Math.PI / 4, z: Math.PI / 180 * 2 });
// loadPlant('models/aloe.glb', { x: 5, y: 0.65, z: -5 }, 1.2);
// loadPlant('models/mint.glb', { x: 9, y: 0.45, z: -15 }, 1.2);
// loadPlant('models/chamomile.glb', { x: -5, y: 0.55, z: -15 }, 2.2);
// loadPlant('models/echinacea.glb', { x: 0, y: 0.0, z: -17 }, 2.2, { x: Math.PI / 180 * 20, y: -Math.PI / 2, z: 0 });
// loadPlant('models/echinopsis-pachanoi.glb', { x: 0, y: -1, z: -7 }, 2.2);
// loadPlant('models/ginko-biloba.glb', { x: -5, y: 0.5, z: -7 }, 2.2);
// loadPlant('models/opuntia-cochenillifera.glb', { x: 5, y: 0.5, z: -7 }, 2.2, { x: 0, y: Math.PI, z: 0 });
// loadPlant('models/gudchi.glb', { x: -5, y: 0.5, z: -3 }, 2.2);


// First-Person Controls (Pointer Lock)
const controls = new THREE.PointerLockControls(camera, document.body);
document.getElementById("capture-lock-btn").addEventListener("click", () => {
    controls.lock();
    // document.getElementById("capture-lock-btn").textContent = "Locked";
});
scene.add(controls.getObject());

// Movement Controls
const movementSpeed = 0.10;
const keys = {};
document.addEventListener("keydown", (event) => (keys[event.code] = true));
document.addEventListener("keyup", (event) => (keys[event.code] = false));

// Infinite Grass Effect - Repositioning Ground
function updateGroundPosition() {
    let playerX = controls.getObject().position.x;
    let playerZ = controls.getObject().position.z;

    // Move ground tile with player
    ground.position.x = Math.round(playerX / 100) * 100;
    ground.position.z = Math.round(playerZ / 100) * 100;
}

// Character Movement
function moveCharacter() {
    prevCameraPosition.copy(camera.position);

    if (keys["KeyW"]) controls.moveForward(movementSpeed);
    if (keys["KeyS"]) controls.moveForward(-movementSpeed);
    if (keys["KeyA"]) controls.moveRight(-movementSpeed);
    if (keys["KeyD"]) controls.moveRight(movementSpeed);

    updateGroundPosition(); // Update ground position to simulate infinity
}

document.addEventListener("mousemove", (event) => {
    let movementX = event.movementX || 0;
    let movementY = event.movementY || 0;

    // Set rotation order to YXZ (important for limited vertical rotation)
    camera.rotation.order = "YXZ";

    // Allow left-right rotation (unrestricted)
    controls.getObject().rotation.y -= movementX * 0.002;

    // Restrict up-down rotation (clamp between -60° and 1°)
    let maxVerticalAngle = Math.PI / 180;
    let minVerticalAngle = -Math.PI / 180 * 60;

    camera.rotation.x -= movementY * 0.002; // Apply movement
    camera.rotation.x = Math.max(minVerticalAngle, Math.min(maxVerticalAngle, camera.rotation.x)); // Restrict rotation
});


// 2. Set up the raycaster for collision detection
const direction = new THREE.Vector3(0, 0, -1); // Direction the camera is moving (forward)

// Animate Scene
function animate() {
    requestAnimationFrame(animate);
    moveCharacter();
    updateCameraPosition();
    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});


// walls
// Create a simple wall (a box)
const wallGeometry = new THREE.BoxGeometry(20, 2, 0.5); // width, height, depth (thickness of the wall)
const gateWallGeometry = new THREE.BoxGeometry(8.5, 2, 0.5); // width, height, depth (thickness of the wall)

const wallTexture = textureLoader.load('textures/bricks.jpg');
wallTexture.wrapS = THREE.RepeatWrapping; // Horizontal repeat
wallTexture.wrapT = THREE.RepeatWrapping; // Vertical repeat
wallTexture.repeat.set(8, 1); // Repeat the texture 4 times on both axes

const gateWallTexture = textureLoader.load('textures/bricks.jpg');
gateWallTexture.wrapS = THREE.RepeatWrapping; // Horizontal repeat
gateWallTexture.wrapT = THREE.RepeatWrapping; // Vertical repeat
gateWallTexture.repeat.set(4, 1); // Repeat the texture 4 times on both axes

// const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // wall color (brown)
const wallMaterial = new THREE.MeshLambertMaterial({ map: wallTexture });
const gateWallMaterial = new THREE.MeshLambertMaterial({ map: gateWallTexture });

const gateWallLeft = new THREE.Mesh(gateWallGeometry, gateWallMaterial);
gateWallLeft.position.set(-6, 1, 0.1);
const gateWallRight = new THREE.Mesh(gateWallGeometry, gateWallMaterial);
gateWallRight.position.set(6, 1, 0.1);

const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
wallLeft.rotation.y = Math.PI / 2;
wallLeft.position.set(-10, 1, -9.75);
const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);
wallRight.rotation.y = Math.PI / 2;
wallRight.position.set(10, 1, -9.75);

const wallEnd = new THREE.Mesh(wallGeometry, wallMaterial);
wallEnd.position.set(0, 1, -19.5)

scene.add(
    gateWallLeft,
    gateWallRight,
    wallLeft,
    wallRight,
    wallEnd
);



// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Dictionary to store plant information
const plantInfo = {
    "basil": { name: "Basil", description: "Used in Italian dishes, herbal remedies, and as a natural insect repellent." },
    "aloe": { name: "Aloe Vera", description: "Famous for its skin healing and medicinal uses." },
    "mint": { name: "Mint", description: "A refreshing herb used in food and medicine." },
    "chamomile": { name: "Chamomile", description: "Chamomile is used to promote relaxation, reduce anxiety, and improve sleep quality. It also helps with digestive issues, inflammation, and skin conditions due to its anti-inflammatory and antioxidant properties." },
    "echinacea": { name: "Echinacea", description: "Boosts the immune system and fights infections." },
    "ginko-biloba": { name: "Ginko Biloba", description: "Ginkgo biloba improves memory, brain function, and blood circulation, helping with dementia, anxiety, and heart health. It also reduces inflammation, supports eye health, and may aid in migraines and respiratory issues." },
    "opuntia-cochenillifera": { name: "Opuntia", description: "A type of cactus with medicinal properties.Cacti are known for their ability to store water and are used in traditional medicine for various health benefits." },
    "gudchi": { name: "Gudchi", description: "A powerful herb in Indian medicine for immunity." }
};

// Function to show plant info
function showPlantInfo(name) {
    const info = plantInfo[name];
    if (info) {
        document.getElementById("plant-name").textContent = info.name;
        document.getElementById("plant-description").textContent = info.description;
        document.getElementById("plant-info").style.display = "block";
    }
}

// Detect click event on the scene
window.addEventListener('click', (event) => {
    event.preventDefault();

    // Convert mouse position to normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mouse, camera);

    // Find intersected objects
    const intersects = raycaster.intersectObjects(models, true);

    if (intersects.length > 0) {
        let selectedModel = intersects[0].object;

        // Find the parent model (to get the correct plant)
        while (selectedModel.parent && selectedModel.parent !== scene) {
            selectedModel = selectedModel.parent;
        }

        const modelName = selectedModel.name.toLowerCase();

        // Display plant information
        showPlantInfo(modelName);
    }
});

// Load 3D Models & Assign Names
function loadPlant(modelPath, position, scale = 0.025, rotation = { x: 0, y: 0, z: 0 }) {
    gltfLoader.load(modelPath, function (gltf) {
        let plant = gltf.scene;
        plant.position.set(position.x, position.y, position.z);
        plant.scale.set(scale, scale, scale);
        plant.name = modelPath.split('/').pop().split('.')[0]; // Extract name from path
        models.push(plant); // Store in array
        scene.add(plant);
    });
}
