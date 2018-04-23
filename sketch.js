var scene = new THREE.Scene();
var width = 1000;
var height = 700;
var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000000);
var controls = new THREE.PointerLockControls(camera);
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var renderer = new THREE.WebGLRenderer();
scene.add(controls.getObject())
controls.enabled = false
const gravity = 5

window.onload = function() {
    if (!isBrowserCompatible()) {
        console.log("Sorry, this browser is not compatible.")
        return
    }

    addPointerLockListeners()
    
    setupRender()
    
    var playerLight = addLights()
    
    var terrain = setupWorld()
    
    controls.getObject().position.copy(new THREE.Vector3(-512, 0, -512))
    
    var playerHeight = 10.0;
    
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

