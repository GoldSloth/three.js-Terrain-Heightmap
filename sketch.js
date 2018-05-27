var performanceTest = false

var scene = new THREE.Scene();
var width = 1000;
var height = 700;
var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 10000);
var controls = new THREE.PointerLockControls(camera);
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();
scene.add(controls.getObject())
controls.enabled = false
const gravity = 5

// World parameters

var sizeX = 100
var sizeY = 100

var scaleX = 2
var scaleY = 2

console.log("Total worldsize is " + (sizeX * scaleX) + "m by " + (sizeY * scaleY) + "m")

var magnitudeY = 0.5

window.onload = function() {
    if (!isBrowserCompatible()) {
        console.log("Sorry, this browser is not compatible.")
        return
    }
    addPointerLockListeners()
    
    setupRender()
    
    terrainFromImage('https://image.ibb.co/gSnq0o/custom_Map.png')
//    terrainFromMath(128, 20, 20)
    
}

function main() {
    var playerLight = addLights()

    var terrain = new THREE.Object3D()
    
    for (var i=0; i<scene.children.length; i++) {
        if (scene.children[i].name == "terrainmesh") {
            terrain.add(scene.children[i].clone())
        }
    }
    console.log(scene)
    var playerHeight = 5.0;

    var collider = new Collider(controls.getObject().position, terrain, playerHeight)

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

            playerLight.position.copy(controls.getObject().position)
        }
        prevTime = time;
    renderer.render( scene, camera );
    }
    updateScreen()
}

