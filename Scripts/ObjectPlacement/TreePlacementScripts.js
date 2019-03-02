function BasicObjectPlacer(existingObjects, perams) {
    var worldSize = perams.worldSize
    var bufferZone = perams.bufferZone
    var _bufferZoneSq = bufferZone * bufferZone
    
    var isGood = false

    while (!isGood) {
        var attemptedPosition = new THREE.Vector3(
            (worldSize / 2) - ((Math.random() * worldSize)),
            100,
            (worldSize / 2) - ((Math.random() * worldSize))
        )
        console.log(attemptedPosition)
        for (var position of existingObjects) {
            if (position.distanceToSquared(attemptedPosition) < _bufferZoneSq) {
                break
            }
        }
        isGood = true
    }

    return attemptedPosition
}
