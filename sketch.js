var scene = new THREE.Scene();
var width = 1000;
var height = 700;
var camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000000);
var controls = new THREE.PointerLockControls(camera);
var prevTime = performance.now();
var velocity = new THREE.Vector3();

window.onload = function() {
    if (!isBrowserCompatible()) {
        console.log("Sorry, this browser is not compatible.")
        return
    }

    addPointerLockListeners()
    
    scene.add(controls.getObject())
    var raycaster = new THREE.Raycaster();

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById("render").appendChild(renderer.domElement);
    var amblight = new THREE.AmbientLight(0xffffff, 0.3)
    var Light = new THREE.PointLight(0xffffff, 0.7)

    scene.add(amblight)
    scene.add(Light)
    
// res, multiplier, scene, terrainProfile
    var objects = loadTerrain(15, 2.5, scene, terrainProfile)
    
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
    waterMesh.position.y += 80
    scene.add(waterMesh)
    
    var playerHeight = 10.0;
    controls.getObject().position.copy(new THREE.Vector3(-512, 256, -512))
    
    function doStuff() {
        requestAnimationFrame(doStuff)
        renderer.render(scene, camera)
        if (controls.enabled) {
            var time = performance.now()
            var delta = ( time - prevTime )/100;
            velocity.multiplyScalar(delta)
            
            controls.getObject().translateX(velocity.x);
            controls.getObject().translateY(velocity.y);
            controls.getObject().translateZ(velocity.z);
            raycaster.set(controls.getObject().position, (new THREE.Vector3(0, -1, 0)).normalize())
            
            var intersections = raycaster.intersectObject(terrain, true)
            
            const gravity = 0.5 * delta
            if(intersections.length > 0) {
                var playerDistanceFromIntersection = intersections[0].distance - playerHeight
            
                if(playerDistanceFromIntersection > gravity) {
                    controls.getObject().translateY(-gravity)
                } else if(playerDistanceFromIntersection > 0 && playerDistanceFromIntersection < gravity) {
                    controls.getObject().translateY(-playerDistanceFromIntersection);
                } else if(playerDistanceFromIntersection < 0) {
                    controls.getObject().translateY(-playerDistanceFromIntersection);
                }
            } else {
                controls.getObject().translateY(-10);
            }
            
            prevTime = time;
            Light.position.copy(controls.getObject().position)
        }
    renderer.render( scene, camera );
    }
    doStuff()
}

