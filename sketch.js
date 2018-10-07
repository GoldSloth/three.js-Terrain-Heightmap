var performanceTest = true

var pointerLockElement = document.body

var scene = new THREE.Scene();
var width = 1920;
var height = 800;
var camera = new THREE.PerspectiveCamera(75, (window.innerWidth*0.95)/(window.innerHeight*0.95), 0.1, 10000);
var controls
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();

var collider

const gravity = 5

// World parameters

var worldSize = 600
var magnitudeY = 50

console.log("Total worldsize is " + worldSize.x + "m by " + worldSize.y + "m")

    
    
    // for (var i=0; i<scene.children.length; i++) {
    //     if (scene.children[i].name == "terrainmesh") {
    //         terrain.add(scene.children[i].clone())
    //     }
    // }
    // console.log(scene)    

if (!isBrowserCompatible()) {
    console.log("Sorry, this browser is not compatible.")
} else {

    setupPointerLock()

    setupRender()
    //    terrainFromImage('https://image.ibb.co/gSnq0o/custom_Map.png')
    var perlinTerrain = new Terrain(worldSize, 100, "perlin", magnitudeY, Math.random(), 200)
    perlinTerrain.setColours(terrainProfile)
    var TerrainMesh = perlinTerrain.drawBufferGeometry()
    scene.add(TerrainMesh)

    addLights()

    var playerHeight = 5.0;
    controls.getObject().position.y = 0
    collider = new Collider(controls.getObject().position, TerrainMesh, playerHeight)
    createWater()

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
