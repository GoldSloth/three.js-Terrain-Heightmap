function loadTerrain(res, sampling, multiplier, scene) {
    var c = document.getElementById('heightMap');
    var ctx = c.getContext('2d')
    var img = document.getElementById('heightImage');
    ctx.drawImage(img, 0, 0);
    
    var imgData = ctx.getImageData(0, 0, c.width, c.height);
    var data = imgData.data;
    console.log(data)
    var minValue = 0;
    var maxValue = 0;
    var imageData = [];
    for (var i=0; i<data.length/4; i++) {
        imageData.push(data[i*4])
        if (data[i*4] >maxValue) {
            maxValue = data[i*4]
        }
        if (data[i*4] <minValue) {
            minValue = data[i*4]
        }
    }
    console.log(imageData)

    var imageResult = [];
    for (var x=0; x<imageData.length; x+=res) {
        imageResult.push(imageData.slice(x, x+res))
    }
    console.log(imageResult)
    var meshArray = []
    console.log('Starting render call')
    for (var x=0; x<imageResult.length; x += sampling) {
        console.log('Adding box ' + x)
        for (var y=0; y<imageResult[x].length; y += sampling) {
            var colorSetting = ((imageResult[x][y]-minValue)/maxValue)*200
            var colorMap = 256-Math.floor(colorSetting);
            var material = new THREE.MeshLambertMaterial({color: 'rgb( 20, ' + colorMap + ', 20)'});
            var geometry = new THREE.BoxBufferGeometry(1, imageResult[x][y] * multiplier, 1)
            var cube = new THREE.Mesh(geometry, material)
            scene.add(cube)
            meshArray.push(cube)
            cube.position.x = x/sampling;
            cube.position.y = (imageResult[x][y]*(multiplier/2))-(10*multiplier)
            cube.position.z = y/sampling;
        }
    }
    return meshArray
}