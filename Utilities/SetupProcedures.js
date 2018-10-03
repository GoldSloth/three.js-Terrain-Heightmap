function setupRender() {
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("render").appendChild(renderer.domElement);
}

function addLights() {
    var amblight = new THREE.AmbientLight(0xffffff, 0.2)
    var playerLight = new THREE.DirectionalLight(0xffffff, 0.9)
    playerLight.position.x += worldSize.x/2
    playerLight.position.y += worldSize.y/2

    scene.add(playerLight)
    
    return playerLight
}

function createWater() {
    var waterTexture = new THREE.TextureLoader().load("./Textures/water.jpg");
    var waterPlane = new THREE.PlaneGeometry(worldSize.x, worldSize.y)
    var waterMaterial = new THREE.MeshPhongMaterial({map: waterTexture, transparent: true, opacity: 0.5})
    var waterMesh = new THREE.Mesh(waterPlane, waterMaterial)
    waterMesh.material.side = THREE.DoubleSide;
    waterMesh.rotateX(THREE.Math.degToRad(90))
    waterMesh.position.y += 15
    scene.add(waterMesh)
}
