function terrainFromMath(heightRange, oSizeX, oSizeY) {
    var perlin = new SimplexNoise('seed')
    var perlinMap = []
    for (var x=0; x<oSizeX; x++) {
        var temp = []
        for (var y=0; y<oSizeY; y++) {
            temp.push(((perlin.noise2D(x,y)+1)/2)*heightRange)
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
    terrain.draw()
    if (performanceTest) {
        console.log('Time for drawing terrain: ' + (performance.now()-time))
        var time = performance.now()
    }
    main()
}
