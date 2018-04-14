window.onload = function() {
    if (!isBrowserCompatible()) {
        console.log("Sorry, this browser is not compatible.")
        return
    }

    addPointerLockListeners()
    


    var controlsEnabled = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();


    var camera;
    var width = 1000;
    var height = 700;
    var scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width/height, 0.001, 1000000);
    var controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject())
    var raycaster = new THREE.Raycaster();
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true;
                break;
            case 40: // down
            case 83: // s
                moveBackward = true;
                break;
            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            case 32: // space
                velocity.y += 100;
                break;
            case 16: // shift
                velocity.copy(velocity.multiplyScalar(3))
                break;
            case 17: // control
                velocity.y -= 100;
                break;
        }
    };
    var onKeyUp = function ( event ) {
        switch( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;
            case 37: // left
            case 65: // a
                moveLeft = false;
                break;
            case 40: // down
            case 83: // s
                moveBackward = false;
                break;
            case 39: // right
            case 68: // d
                moveRight = false;
                break;
        }
    };
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );
    
    window.addEventListener('keydown', function(e) {
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
      }
    });
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("render").appendChild(renderer.domElement);
    var amblight = new THREE.AmbientLight(0xffffff, 0.3)
    var Light = new THREE.PointLight(0xffffff, 0.3)

    scene.add(amblight)
    scene.add(Light)
    
// res, multiplier, scene, terrainProfile
    var objects = loadTerrain(15, 2.5, scene, terrainProfile)
    
    var terrain = new THREE.Object3D()
    for (var i=0; i < objects.length; i++) {
        terrain.add(objects[i].clone())
    }
    var worldSize = Math.sqrt(objects.length)*15
    console.log(worldSize)
    var waterPlane = new THREE.PlaneGeometry(worldSize, worldSize)
    var waterMaterial = new THREE.MeshPhongMaterial({color: "rgb(80, 146, 252)"})
    var waterMesh = new THREE.Mesh(waterPlane, waterMaterial)
    waterMesh.material.side = THREE.DoubleSide;
    scene.add(waterMesh)
    var playerHeight = 10.0;
    controls.getObject().position.copy(new THREE.Vector3(-512, 100, -512))
    function doStuff() {
        requestAnimationFrame(doStuff);
        renderer.render(scene, camera);
        if ( controlsEnabled ) {
            var time = performance.now();
            var delta = ( time - prevTime ) / 1000;
            if (moveForward) {
                velocity.z -= 60 * delta
            } else if (moveBackward) {
                velocity.z += 40 * delta
            }
            if (moveRight) {
                velocity.x += 40 * delta
            }
            if (moveLeft) {
                velocity.x -= 40 * delta
            }
            
            controls.getObject().translateX( velocity.x * delta * 6);
            controls.getObject().translateZ( velocity.z * delta * 6);
            raycaster.set(controls.getObject().position, (new THREE.Vector3(0, -1, 0)).normalize())
            var intersections = raycaster.intersectObject(terrain, true)
            if (intersections.length == 0) {
                velocity.y -= 10;
                controls.getObject().translateY(velocity.y * delta)
            } 
            if (intersections.length > 0) {
                if (intersections[0].distance >= playerHeight * 2) {
                    velocity.y -= 10;
                    controls.getObject().translateY(velocity.y * delta)
                } else if (intersections[0].distance >= playerHeight * 1.2){
                    velocity.y -= 1;
                    controls.getObject().translateY(velocity.y * delta)
                } else if (intersections[0].distance >= playerHeight){
                    velocity.y -= 0.5;
                    controls.getObject().translateY(velocity.y * delta)
                } else if (intersections[0].distance <= playerHeight) {
                    controls.getObject().translateY(playerHeight - intersections[0].distance)
                    velocity.y = 0
                }
            }

            var cancelThreshold = 5
            var decelerationFactor = 10
            if ((velocity.x > cancelThreshold) || (velocity.x < -cancelThreshold)) {
                velocity.x -= (velocity.x/decelerationFactor)
            } else {
                velocity.x = 0
            }
            if ((velocity.z > cancelThreshold) || (velocity.z < -cancelThreshold)) {
                velocity.z -= (velocity.z/decelerationFactor)
            } else {
                velocity.z = 0
            }
            prevTime = time;
            Light.position.copy(controls.getObject().position)
            Light.lookAt(0, 0, 0)
        }
    renderer.render( scene, camera );
    }
    doStuff()
}