function BasicObjectPlacer(existingObjects, perams) {
    var worldSize = perams.worldSize
    var bufferZone = perams.bufferZone
    var _bufferZoneSq = bufferZone * bufferZone
    
    var isGood = false

    while (!isGood) {
        var attemptedPosition = new THREE.Vector3(
            Math.random() * worldSize,
            100,
            Math.random() * worldSize
        )
        for (var obj in existingObjects) {
            if (obj.position.distanceToSquared(attemptedPosition) < _bufferZoneSq) {
                break
            }
        }
        isGood = true
    }

    return attemptedPosition
}