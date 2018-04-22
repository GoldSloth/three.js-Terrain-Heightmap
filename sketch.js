var scene = new THREE.Scene();
var width = 1000;
var height = 700;
var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000000);
var controls = new THREE.PointerLockControls(camera);
var prevTime = performance.now();
var velocity = new THREE.Vector3();
var raycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
scene.add(controls.getObject())

window.onload = function() {
    if (!isBrowserCompatible()) {
        console.log("Sorry, this browser is not compatible.")
        return
    }

    addPointerLockListeners()
    
    setupRender()
    
    var playerLight = addLights()
    
    var terrain = setupWorld()
    
    var playerHeight = 10.0;
    controls.getObject().position.copy(new THREE.Vector3(-512, 256, -512))
    
    function doStuff() {
        requestAnimationFrame(doStuff)
        renderer.render(scene, camera)
        if (controls.enabled) {
            var time = performance.now()
            var delta = ( time - prevTime )/100;
            velocity.multiplyScalar(delta)
            
            controls.getObject().translateX(velocity.x);
            controls.getObject().translateY(velocity.y);
            controls.getObject().translateZ(velocity.z);
            raycaster.set(controls.getObject().position, (new THREE.Vector3(0, -1, 0)).normalize())
            
            var intersections = raycaster.intersectObject(terrain, true)
            
            const gravity = 0.5 * delta
            if(intersections.length > 0) {
                var playerDistanceFromIntersection = intersections[0].distance - playerHeight
            
                if(playerDistanceFromIntersection > gravity) {
                    controls.getObject().translateY(-gravity)
                } else if(playerDistanceFromIntersection > 0 && playerDistanceFromIntersection < gravity) {
                    controls.getObject().translateY(-playerDistanceFromIntersection);
                } else if(playerDistanceFromIntersection < 0) {
                    controls.getObject().translateY(-playerDistanceFromIntersection);
                }
            } else {
                controls.getObject().translateY(-10);
            }
            
            prevTime = time;
            playerLight.position.copy(controls.getObject().position)
        }
    renderer.render( scene, camera );
    }
    doStuff()
}

