var rawImage
var terrainObject
function terrainFromImage(imageURL) {
    rawImage = new MarvinImage()
    rawImage.load(imageURL, interpretImage)
    console.log(rawImage)

}

function interpretImage() {
    var conciseArray = []
    for (var i = 0; i<rawImage.imageData.data.length; i+=4) {
        conciseArray.push(((rawImage.imageData.data[i] + rawImage.imageData.data[i+1] + rawImage.imageData.data[i+2])/3))
    }
    console.log(conciseArray)
    var mappedArray = []
    for (var x = 0; x<rawImage.width; x++) {
        var temp = []
        for (var y = 0; y<rawImage.height; y++) {
            temp.push(conciseArray[x*rawImage.width+y])
        }
        mappedArray.push(temp)
    }
    console.log(mappedArray)
    if (performanceTest) {
        var time = performance.now()
    }
    var terrain = new Terrain(mappedArray)
    if (performanceTest) {
        console.log('Time for creating terrain: ' + (performance.now()-time))
        var time = performance.now()
    }
    terrain.changeRes(sizeX, sizeY)
    if (performanceTest) {
        console.log('Time for changing resoloution: ' + (performance.now()-time))
        var time = performance.now()
    }
    terrain.changeMultiplier(magnitudeY)
    if (performanceTest) {
        console.log('Time for creating multiplier: ' + (performance.now()-time))
        var time = performance.now()
    }
    terrain.draw()
    if (performanceTest) {
        console.log('Time for drawing terrain: ' + (performance.now()-time))
        var time = performance.now()
    }
    main()
}

