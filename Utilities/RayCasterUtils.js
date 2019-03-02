function GetHeight(position, doSub) {
    raycaster = new THREE.Raycaster();
    intersections = [];
    
    raycaster.set(position, (new THREE.Vector3(0, -1, 0)).normalize())
    intersections = raycaster.intersectObject(TerrainMesh, true)  
    
    if (intersections.length > 0) {
        if (doSub)
            return position.y - intersections[0].distance
        else
            return intersections[0].distance
    } else {
        return -1
    }
}
