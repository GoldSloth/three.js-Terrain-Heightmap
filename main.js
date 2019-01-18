const goldenRatio = 1.618033988749895
const iGoldenRatio = 1/goldenRatio

const scaleRatio = 1.8

var performanceTest = true

var pointerLockElement = document.body

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth * 0.95) / (window.innerHeight * 0.95), 0.1, 10000);
var controls
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();
var mapTools
var TerrainMesh

var collider

const gravity = 5

// World parameters

const worldSize = 1000
const magnitudeY = 150

console.log("Total worldsize is " + worldSize + "m by " + worldSize + "m")

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
        "segments": 50,
        "type": "perlin",
        "yAmplitude": magnitudeY,
        "seed": seed,
        "operation": lDistribute,
        "perlins": [
            {
                "seed": Math.random(),
                "multiplier": 0.6,
                "wavelength": 300 * scaleRatio
            },
            {
                "seed": Math.random(),
                "multiplier": 0.2,
                "wavelength": 100 * scaleRatio
            },
            {
                "seed": Math.random(),
                "multiplier": 0.1,
                "wavelength": 50 * scaleRatio
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
    TerrainMesh = perlinTerrain.drawBufferGeometry()
    scene.add(TerrainMesh)

    mapTools = new MapTools(worldSize, magnitudeY, perlinTerrain, 50)
    mapTools.makeMap()
    mapTools.drawHelper()
    LoadObjects()

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
