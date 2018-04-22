function makeChangeToVelocity(changeInVelocity) {
    velocity = velocity.add(changeInVelocity)
}

function onKeyDown(event) {
    const speed = 1
    var changeInVelocity = new THREE.Vector3()
    switch ( event.keyCode ) {
        case 38: // up
        case 87: // w
            //moveForward = true;
            changeInVelocity.z = -1.7*speed
            break
        case 37: // left
        case 65: // a
    //                moveLeft = true;
            changeInVelocity.x = -1*speed
            break
        case 40: // down
        case 83: // s
    //                moveBackward = true;
            changeInVelocity.z = speed
            break
        case 39: // right
        case 68: // d
    //                moveRight = true;
            changeInVelocity.x = speed
            break
        case 32: // space
            changeInVelocity.y = 10;
            break
    //            case 16: // shift
    //                velocity.copy(velocity.multiplyScalar(3))
    //                return velocity
        case 17: // control
            changeInVelocity.y = -4;
            break
    }
    makeChangeToVelocity(changeInVelocity)
}

