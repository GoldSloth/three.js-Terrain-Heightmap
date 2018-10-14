class Terrain {
    constructor(size, segments, type, yAmplitude, seed, perlinModifier) {
        this.size = size
        this.segments = segments
        this.yAmplitude = yAmplitude

        this.normalisedPerl = []
        if (seed === undefined || seed === null) {
            seed = Math.random()
        }
        if (perlinModifier === undefined || perlinModifier === null) {
            perlinModifier = 1/200
        }


        if (type == "perlin") {
            this._makeFromPerlin(seed, perlinModifier)
        } else if (type == "image") {
            this._makeFromImage()
        } else {
            console.log("Terrain generation failed. Please specify a valid type.")
        }
        // Chart mode: ACTIVATE
        
    }

    _makeFromPerlin(seed, perlinModifier) {
        var perlin1 = new SimplexNoise(seed)
        this.indices = []
        this.vertices = []
        this.normals = []

        var halfSize = this.size/2
        var segmentSize = this.size/this.segments

        for (var i = 0; i <= this.segments; i++) {
            var z = (i * segmentSize) - halfSize
            for (var j = 0; j <= this.segments; j++) {
                var x = (j * segmentSize) - halfSize
                var rawPerlin = (perlin1.noise2D(x / perlinModifier, z / perlinModifier) + 1) / 2

                this.normalisedPerl.push(rawPerlin)

                var y = rawPerlin  * magnitudeY
                this.vertices.push(x, y, z)

                this.normals.push(0 , 1, 0)
            }
        }
    }

    _makeChart() {
        var chartCanvas = document.createElement('canvas')
        chartCanvas.setAttribute("id", "chartCanvas")
        chartCanvas.style.cssText = 'position:absolute;width:50%;height:50%;'
        document.body.appendChild(chartCanvas)

        var chartElement = document.getElementById("chartCanvas").getContext("2d")
        const subDivisions = 10
        // 1 % increment must equal 0.
        const increment = 1/subDivisions
        var chartDataE = []
        var labels = []
        for (var i=0; i <= subDivisions; i++) {
            chartDataE.push(0)
            labels.push(i*increment)
        }
        console.log(chartData)
        for (var i=0; i < this.normalisedPerl.length; i++) {
            for (var j=0; j < subDivisions; j++) {
                if (this.normalisedPerl[i] > j * increment && this.normalisedPerl[i] < (j + 1) * increment) {
                    chartDataE[j] += 1
                    break
                }
            }
            
        }

        var normalisedChartDataE = []
        for (var i=0; i<chartDataE.length; i++) {
            normalisedChartDataE.push((chartDataE[i]/this.normalisedPerl.length) * 100)
        }
        var chartData = {
            "labels": labels,
            datasets: [{
                label: "Frequency",
                data: normalisedChartDataE,
                fill: false
            }]
        }

        console.log(chartData)
        var distributionChart = new Chart(chartElement, {
            type: 'line',
            data: chartData,
            options: {
                animation: {
                    duration: 0, // general animation time
                },
                hover: {
                    animationDuration: 0, // duration of animations when hovering an item
                },
                responsiveAnimationDuration: 0, // animation duration after a resize
            }
        })
    }

    _makeFromImage() {
        // 
    }

    formNormalDistribution() {

    }

    formSecondPerlin() {

    }

    enlistColourProfile() {
        this.terrainColours = []
        // Sand
        this.terrainColours.push(new THREE.Vector4(0.0, 0.9, 0.9, 0.7))
        // Grass
        this.terrainColours.push(new THREE.Vector4(0.1, 0.3, 0.7, 0.2))
        // Dark Grass
        this.terrainColours.push(new THREE.Vector4(0.4, 0.2, 0.4, 0.15))
        // Light Rock
        this.terrainColours.push(new THREE.Vector4(0.7, 0.5, 1.5, 0.5))
        // Dark Rock
        this.terrainColours.push(new THREE.Vector4(0.8, 0.5, 1.5, 0.5))
        // Snow
        this.terrainColours.push(new THREE.Vector4(1.0, 1.0, 1.0, 1.0))
    }

    drawBufferGeometry() {
        for (var i = 0; i < this.segments; i++) {
            for (var j = 0; j < this.segments; j++) {
                var a = i * ( this.segments + 1 ) + ( j + 1 );
                var b = i * ( this.segments + 1 ) + j;
                var c = ( i + 1 ) * ( this.segments + 1 ) + j;
                var d = ( i + 1 ) * ( this.segments + 1 ) + ( j + 1 );
                // generate two faces (triangles) per iteration
                this.indices.push( a, b, d ); // face one
                this.indices.push( b, c, d ); // face two
            }
        }
        this.geometry = new THREE.BufferGeometry()

        this.geometry.setIndex(this.indices);
        this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
        this.geometry.addAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3));

        this.geometry.computeVertexNormals()
        this.geometry.computeFaceNormals()
        this.geometry.computeBoundingBox()
        this.geometry.computeBoundingSphere()

        this.VertShader = new VertexShader()
        this.FragShader = new FragmentShader(this.terrainColours)

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {
                    'lightIntensity': {type: 'f', value: 1.0},
                    'terrainColors': {value: this.terrainColours, type: 'v4v'},
                    'magnitudeY': {type: 'f', value: this.yAmplitude}
                }
            ]),
            transparent: true,
            lights: true,
            vertexShader: this.VertShader.getText(),
            fragmentShader: this.FragShader.getText()
 
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        console.log(this.mesh)
        return this.mesh
    }
}