function setupRender() {
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("render").appendChild(renderer.domElement);
}

function addLights() {
    var amblight = new THREE.AmbientLight(0xffffff, 0.3)
    var playerLight = new THREE.PointLight(0xffffff, 0.7)
    scene.add(amblight)
    scene.add(playerLight)
    return playerLight
}

function setupWorld() {
    // res, multiplier, scene, terrainProfile
    var objects = loadTerrain(15, 2.5, terrainProfile)
    
    var terrain = new THREE.Object3D()
    for (var i=0; i < objects.length; i++) {
        terrain.add(objects[i].clone())
    }
    
    var worldSize = Math.sqrt(objects.length)*15
    console.log(worldSize)
    var waterPlane = new THREE.PlaneGeometry(worldSize, worldSize)
    var waterMaterial = new THREE.MeshPhongMaterial({color: "rgb(80, 146, 252)", transparent: true, opacity: 0.8})
    var waterMesh = new THREE.Mesh(waterPlane, waterMaterial)
    waterMesh.renderOrder = 1
    waterMesh.material.side = THREE.DoubleSide;
    waterMesh.rotateX(THREE.Math.degToRad(90))
    waterMesh.position.x -= worldSize/2
    waterMesh.position.z -= worldSize/2
    waterMesh.position.y -= 240
    scene.add(waterMesh)
    return terrain
}