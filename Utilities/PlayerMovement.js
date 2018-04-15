function makeChangeToVelocity(changeInVelocity) {
    velocity = velocity.add(changeInVelocity)
}

function onKeyDown(event) {
    var changeInVelocity = new THREE.Vector3()
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            //moveForward = true;
            changeInVelocity.z = -0.7
            break
        case 37: // left
        case 65: // a
    //                moveLeft = true;
            changeInVelocity.x = -0.5
            break
        case 40: // down
        case 83: // s
    //                moveBackward = true;
            changeInVelocity.z = 0.5
            break
        case 39: // right
        case 68: // d
    //                moveRight = true;
            changeInVelocity.x = 0.5
            break
        case 32: // space
            changeInVelocity.y = 1;
            break
    //            case 16: // shift
    //                velocity.copy(velocity.multiplyScalar(3))
    //                return velocity
        case 17: // control
            changeInVelocity.y = -1;
            break
    }
    makeChangeToVelocity(changeInVelocity)
}

