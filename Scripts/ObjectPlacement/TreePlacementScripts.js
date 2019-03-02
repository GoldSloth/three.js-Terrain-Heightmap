function BasicObjectPlacer(existingObjects, perams) {
    var worldSize = perams.worldSize
    var bufferZone = perams.bufferZone
    var _bufferZoneSq = bufferZone * bufferZone
    
    var isGood = false

    while (!isGood) {
        var attemptedPosition = new THREE.Vector3(
            (worldSize / 4) - ((Math.random() * worldSize) / 2),
            100,
            (worldSize / 4) - ((Math.random() * worldSize) / 2)
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
