window.onload = function() {

    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if (havePointerLock) {
        var element = document.body;
        var pointerlockchange = function (event) {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                controlsEnabled = true;
                controls.enabled = true;
            } else {
                controls.enabled = false;
            };
        }
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
            document.getElementById('render').addEventListener( 'click', function ( event ) {
                // Ask the browser to lock the pointer
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                if ( /Firefox/i.test( navigator.userAgent ) ) {
                    var fullscreenchange = function ( event ) {
                        if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
                            document.removeEventListener( 'fullscreenchange', fullscreenchange );
                            document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                            element.requestPointerLock();
                        }
                    };
                        document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                        document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
                        element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
                        element.requestFullscreen();
                    } else {
                        element.requestPointerLock();
                    }
                }, false );
            }

    var controlsEnabled = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;
    var canJump = false;
    var prevTime = performance.now();
    var velocity = new THREE.Vector3();


    var camera;
    var width = 1200;
    var height = 1000;
    var scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width/height, 0.001, 1000000);
    var controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject())
    
    var onKeyDown = function ( event ) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = true;
                break;
            case 37: // left
            case 65: // a
                moveLeft = true; break;
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
                velocity.multiplyScalar(3)
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

    var objects = loadTerrain(20, 8, scene)
    
    function doStuff() {
        requestAnimationFrame(doStuff);
        renderer.render(scene, camera);
        if ( controlsEnabled ) {
            var time = performance.now();
            var delta = ( time - prevTime ) / 1000;
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            if ( moveForward ) velocity.z -= 400.0 * delta;
            if ( moveBackward ) velocity.z += 400.0 * delta;
            if ( moveLeft ) velocity.x -= 400.0 * delta;
            if ( moveRight ) velocity.x += 400.0 * delta;
            controls.getObject().translateX( velocity.x * delta );
            controls.getObject().translateY( velocity.y * delta );
            controls.getObject().translateZ( velocity.z * delta );
            if (velocity.y > 0) {
                velocity.y -= (velocity.y/10)
            }
            prevTime = time;
            Light.position.copy(controls.getObject().position)
            Light.lookAt(0, 0, 0)
        }
    renderer.render( scene, camera );
    }
    doStuff()
}