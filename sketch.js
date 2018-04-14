var scene = new THREE.Scene();
var width = 1000;
var height = 700;
var camera = new THREE.PerspectiveCamera(75, width/height, 0.001, 1000000);
var controls = new THREE.PointerLockControls(camera);
var prevTime = performance.now();
var velocity = new THREE.Vector3();

function makeChangeToVelocity(changeInVelocity) {
    velocity = velocity.add(changeInVelocity)
}

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
    var Light = new THREE.PointLight(0xffffff, 0.3)

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
    var waterMaterial = new THREE.MeshPhongMaterial({color: "rgb(80, 146, 252)"})
    var waterMesh = new THREE.Mesh(waterPlane, waterMaterial)
    waterMesh.material.side = THREE.DoubleSide;
    scene.add(waterMesh)
    
    var playerHeight = 10.0;
    controls.getObject().position.copy(new THREE.Vector3(-512, 200, -512))
    
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
            if(intersections.length>0) {
                var playerDistanceFromIntersection = intersections[0].distance
            
                if(playerDistanceFromIntersection > gravity) {
                    controls.getObject().translateY(-gravity)
                } else if(playerDistanceFromIntersection > 0 && playerDistanceFromIntersection < gravity) {
                    controls.getObject().translateY(-playerDistanceFromIntersection);
                } else if(playerDistanceFromIntersection < 0) {
                    controls.getObject().translateY(-playerDistanceFromIntersection + playerHeight);
                }
            }
            
            
//            controls.getObject().translateY(playerHeight)
            
//            if(intersections[0].distance <= playerHeight) {
//                controls.getObject().translateY(playerHeight - intersections[0].distance)
//                velocity.y = 0
//            }
//            
//            if (intersections.length == 0) {
//                velocity.y -= 10;
//                controls.getObject().translateY(velocity.y * delta)
//            } 
//            if (intersections.length > 0) {
//                if (intersections[0].distance >= playerHeight * 2) {
//                    velocity.y -= 10;
//                    controls.getObject().translateY(velocity.y * delta)
//                } else if (intersections[0].distance >= playerHeight * 1.2){
//                    velocity.y -= 1;
//                    controls.getObject().translateY(velocity.y * delta)
//                } else if (intersections[0].distance >= playerHeight){
//                    velocity.y -= 0.5;
//                    controls.getObject().translateY(velocity.y * delta)
//                } else if (intersections[0].distance <= playerHeight) {
//                    controls.getObject().translateY(playerHeight - intersections[0].distance)
//                    velocity.y = 0
//                }
//            }

            var cancelThreshold = 5
            var decelerationFactor = 10
            if ((velocity.x > cancelThreshold) || (velocity.x < -cancelThreshold)) {
                velocity.x -= (velocity.x/decelerationFactor)
            } else {
                velocity.x = 0
            }
            if ((velocity.z > cancelThreshold) || (velocity.z < -cancelThreshold)) {
                velocity.z -= (velocity.z/decelerationFactor)
            } else {
                velocity.z = 0
            }
            prevTime = time;
            Light.position.copy(controls.getObject().position)
            Light.lookAt(0, 0, 0)
        }
    renderer.render( scene, camera );
    }
    doStuff()
}

