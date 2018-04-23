function pointerLockChange() {
    if (document.pointerLockElement === document.body || document.mozPointerLockElement === document.body || document.webkitPointerLockElement === document.body) {
        controls.enabled = true
        window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
        window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        window.addEventListener('keydown', fixPageScroll)        
    } else {
        controls.enabled = false
        window.removeEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
        window.removeEventListener('keydown', function(event) { Key.onKeydown(event); }, false);
        window.removeEventListener('keydown', fixPageScroll) 
    }
} 

function addPointerLockListeners() {
    document.addEventListener( 'pointerlockchange', pointerLockChange, false )
    document.addEventListener( 'mozpointerlockchange', pointerLockChange, false )
    document.addEventListener( 'webkitpointerlockchange', pointerLockChange, false )
    
    document.getElementById('render').addEventListener( 'click', function ( event ) {
        // Ask the browser to lock the pointer
        document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock || document.body.webkitRequestPointerLock
        if ( /Firefox/i.test( navigator.userAgent ) ) {
            var fullscreenchange = function ( event ) {
                if ( document.fullscreenElement === document.body || document.mozFullscreenElement === document.body || document.mozFullScreenElement === document.body ) {
                    document.removeEventListener( 'fullscreenchange', fullscreenchange )
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange )
                    document.body.requestPointerLock()
                }
            }
            document.addEventListener( 'fullscreenchange', fullscreenchange, false )
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false )
            document.body.requestFullscreen = document.body.requestFullscreen || document.body.mozRequestFullscreen || document.body.mozRequestFullScreen || document.body.webkitRequestFullscreen
            document.body.requestFullscreen()
        } else {
            document.body.requestPointerLock()
        }
    }, false )
}

function fixPageScroll(event) {
    if(event.keyCode == 32 && event.target == document.body) {
        event.preventDefault();
    }
}

