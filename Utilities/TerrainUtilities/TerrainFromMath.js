function terrainFromMath(heightRange, oSizeX, oSizeY, divisionsX, divisionsY) {
    var perlin = new SimplexNoise()
    var perlinMap = []
    for (var x=0; x<oSizeX; x++) {
        var temp = []
        for (var y=0; y<oSizeY; y++) {
            temp.push(((perlin.noise2D(x/divisionsX,y/divisionsY)+1)/2)*heightRange)
        }
        perlinMap.push(temp)
    }
    
    if (performanceTest) {
        var time = performance.now()
    }
    var terrain = new Terrain(perlinMap)
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
    terrain.calculateMinMax()
    terrain.normalize()
    console.log(terrain.heightMap.length)
    console.log(terrain.heightMap[0].length)
    terrain.applyPerlinNoise(0.03, 15, 15)
    terrain.applyPerlinNoise(0.02, 10, 10)
    terrain.applyPerlinNoise(0.003, 5, 5)
    terrain.smoothingFilter(0.2)
    terrain.draw()
    if (performanceTest) {
        console.log('Time for drawing terrain: ' + (performance.now()-time))
        var time = performance.now()
    }
    main()
}
