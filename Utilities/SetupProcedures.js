function setupRender() {
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("render").appendChild(renderer.domElement);
}

function addLights() {
    var amblight = new THREE.AmbientLight(0xffffff, 0.2)
    var playerLight = new THREE.DirectionalLight(0xffffff, 0.9)
    scene.add(playerLight)
    scene.add(amblight)
    
    return playerLight
}

function createWater() {
    var waterPlane = new THREE.PlaneGeometry(worldSize.x, worldSize.y)
    var waterMaterial = new THREE.MeshPhongMaterial({color: "rgb(80, 146, 252)", transparent: true, opacity: 0.5})
    var waterMesh = new THREE.Mesh(waterPlane, waterMaterial)
    waterMesh.material.side = THREE.DoubleSide;
    waterMesh.rotateX(THREE.Math.degToRad(90))
    waterMesh.position.y += 15
    scene.add(waterMesh)
}
