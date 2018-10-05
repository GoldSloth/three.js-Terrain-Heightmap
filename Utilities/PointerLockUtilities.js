function pointerLockChange(event) {
    if ( document.pointerLockElement === pointerLockElement ||
        document.mozPointerLockElement === pointerLockElement ||
        document.webkitPointerLockElement === pointerLockElement 
        ) {
        controls.enabled = true;
        window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
        window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        window.addEventListener('keydown', fixPageScroll)    
    } else {
        controls.enabled = false;
        window.removeEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
        window.removeEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        window.removeEventListener('keydown', fixPageScroll) 
    }
}

function setupPointerLock() {
    pointerLockElement = document.body
    document.addEventListener('pointerlockchange', pointerLockChange, false);
    document.addEventListener('mozpointerlockchange', pointerLockChange, false);
    document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

    document.addEventListener('click', function (event) {
        pointerLockElement.requestPointerLock = pointerLockElement.requestPointerLock || pointerLockElement.mozRequestPointerLock || pointerLockElement.webkitRequestPointerLock;
        if ( /Firefox/i.test( navigator.userAgent ) ) {
            var fullscreenchange = function ( event ) {
                if ( document.fullscreenElement === pointerLockElement || document.mozFullscreenElement === pointerLockElement || document.mozFullScreenElement === pointerLockElement ) {
                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );
                    pointerLockElement.requestPointerLock();
                }
            };
            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );
            pointerLockElement.requestFullscreen = pointerLockElement.requestFullscreen || pointerLockElement.mozRequestFullscreen || pointerLockElement.mozRequestFullScreen || pointerLockElement.webkitRequestFullscreen;
            pointerLockElement.requestFullscreen();
        } else {
            pointerLockElement.requestPointerLock();
        }
    }, false)
    controls = new THREE.PointerLockControls(camera, pointerLockElement);

    scene.add(controls.getObject())
}

function fixPageScroll(event) {
    if(event.keyCode == 32 && event.target == document.body) {
        event.preventDefault();
    }
}