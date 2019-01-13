function setupRender() {
    renderer.setSize(window.innerWidth*0.95, window.innerHeight*0.95);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("render").appendChild(renderer.domElement);
}

function addLights() {
    var ambLighting = new THREE.AmbientLight(0xffffff, 0.3)
    var sun = new THREE.DirectionalLight(0xffffff, 1.0)
    sun.position.x = worldSize / 2
    sun.position.y += 1 * magnitudeY
    sun.position.z = worldSize / 2
    scene.add(ambLighting)
    scene.add(sun)
    
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
