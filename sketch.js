var performanceTest = true

var pointerLockElement = document.body

var scene = new THREE.Scene();
var width = 1920;
var height = 800;
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth * 0.95) / (window.innerHeight * 0.95), 0.1, 10000);
var controls
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();

var collider

const gravity = 5

// World parameters

const worldSize = 1000
const magnitudeY = 150

console.log("Total worldsize is " + worldSize.x + "m by " + worldSize.y + "m")

if (!isBrowserCompatible()) {
    console.log("Sorry, this browser is not compatible.")
} else {

    LdScreen = new LoadingScreen("Loading..... (Could take up to 10 seconds)", "render")
    LdScreen.showText()
    setupPointerLock()

    setupRender()
    var seed = Math.random()

    var worldOptions = {
        "size": worldSize,
        "segments": 128,
        "type": "perlin",
        "yAmplitude": magnitudeY,
        "seed": seed,
        "perlins": [
            {
                "seed": Math.random(),
                "multiplier": 0.6,
                "wavelength": 300
            },
            {
                "seed": Math.random(),
                "multiplier": 0.2,
                "wavelength": 100
            },
            {
                "seed": Math.random(),
                "multiplier": 0.1,
                "wavelength": 50
            }
        ]
    }



    var perlinTerrain = new Terrain(worldOptions)
    perlinTerrain.terrainColours = []
    // Sea
    perlinTerrain.terrainColours.push(new THREE.Vector4(0.0, 0.0, 0.0, 0.5))
    // Sand
    perlinTerrain.terrainColours.push(new THREE.Vector4(0.35, 0.9, 0.9, 0.7))
    // Grass
    perlinTerrain.terrainColours.push(new THREE.Vector4(0.4, 0.3, 0.7, 0.2))
    // Dark Grass
    perlinTerrain.terrainColours.push(new THREE.Vector4(0.6, 0.2, 0.4, 0.15))
    // Light Rock
    perlinTerrain.terrainColours.push(new THREE.Vector4(0.7, 0.4, 0.4, 0.4))
    // Dark Rock
    perlinTerrain.terrainColours.push(new THREE.Vector4(0.8, 0.2, 0.2, 0.2))

    perlinTerrain._makeChart()
    var TerrainMesh = perlinTerrain.drawBufferGeometry()
    scene.add(TerrainMesh)

    addLights()

    var playerHeight = 5.0;
    controls.getObject().position.y += magnitudeY
    collider = new Collider(controls.getObject().position, TerrainMesh, playerHeight)
    createWater()

    LdScreen.removeText()
    updateScreen()


    function updateScreen() {
        requestAnimationFrame(updateScreen)
        renderer.render(scene, camera)
        var time = performance.now()
        var delta = (time - prevTime)/100;
        if (controls.enabled) {
            velocity.multiplyScalar(delta)
            calculateMovement()
            controls.getObject().translateX(velocity.x);
            controls.getObject().translateY(velocity.y);
            controls.getObject().translateZ(velocity.z);
            controls.getObject().translateY(collider.update(delta));
        }
        prevTime = time;
    }
}
