class Terrain {
    constructor(options) {
        this.size = options.size
        this.segments = options.segments
        this.yAmplitude = options.yAmplitude

        this.perlins = options.perlins
        this.operation = options.operation

        this.normalisedPerl = new Array(this.segments * this.segments).fill(0)

        if (options.type == "perlin") {
            this._makeFromPerlin()
        } else {
            console.log("Terrain generation failed. Please specify a valid type.")
        }
        
    }

    _makeFromPerlin() {
        this.indices = []
        this.vertices = []
        this.normals = []
        this.uv = []

        var halfSize = this.size / 2
        var segmentSize = this.size / this.segments

        for (var i = 0; i <= this.segments; i++) {
            var z = (i * segmentSize) - halfSize
            for (var j = 0; j <= this.segments; j++) {
                var x = (j * segmentSize) - halfSize
                this.uv.push(((i / this.segments) + 1) * 0.5, ((j / this.segments) + 1) * 0.5)
                this.normals.push(0 , 1, 0)
                this.vertices.push(x, 0, z)
            }
        }
        var perlin
        for (let currentPerlin of this.perlins) {
            perlin = new SimplexNoise(currentPerlin.seed)
            
            for (var i = 0; i < this.segments; i++) {

                var z = (i * segmentSize) - halfSize

                for (var j = 0; j < this.segments; j++) {

                    var x = (j * segmentSize) - halfSize
                    var rawPerlin = ((perlin.noise2D(x / currentPerlin.wavelength + 1000, z / currentPerlin.wavelength + 1000) + 1) / 2) * currentPerlin.multiplier

                    this.normalisedPerl[i * (this.segments + 1) + j] += rawPerlin 

                    this.vertices[(i * (this.segments + 1) + j) * 3 + 1] += rawPerlin

                }
            }
        }

        for (var i = 1; i < this.vertices.length; i += 3) {
            this.vertices[i] = this.operation(this.vertices[i])
        }

        console.log(this.vertices)

        for (var i = 1; i < this.vertices.length; i += 3) {
            this.vertices[i] *= this.yAmplitude

        }


        
    }

    _makeChart() {
        var chartCanvas = document.createElement('canvas')
        chartCanvas.setAttribute("id", "chartCanvas")
        chartCanvas.style.cssText = 'position:absolute;width:50%;height:50%;'
        document.body.appendChild(chartCanvas)

        var chartElement = document.getElementById("chartCanvas").getContext("2d")
        const subDivisions = 20
        // 1 % increment must equal 0.
        const increment = 1/subDivisions
        var chartDataE = []
        var labels = []
        for (var i=0; i <= subDivisions; i++) {
            chartDataE.push(0)
            labels.push(i*increment)
        }
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
        this.geometry.addAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3))
        this.geometry.addAttribute('normal', new THREE.Float32BufferAttribute(this.normals, 3))
        this.geometry.addAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2))


        this.geometry.computeVertexNormals()
        this.geometry.computeFaceNormals()
        this.geometry.computeBoundingBox()
        this.geometry.computeBoundingSphere()

        this.VertShader = new VertexShader()
        this.FragShader = new FragmentShader(this.terrainColours)

        var heightTextureSize = new THREE.Vector2(1024, 1024)
        var colourTextureSize = new THREE.Vector2(1024, 1024)

        var heightTexture = new RGBUInt8PerlinTexture(heightTextureSize)
        heightTexture.makeFirstLayer(150, 0.75)
        heightTexture.makeNewLayer(7, 0.25)

        var rawHeightTexture = heightTexture.image

        var colourTexture = new RGBUInt8PerlinTexture(colourTextureSize)
        colourTexture.makeFirstLayer(100, 0.75)
        colourTexture.makeNewLayer(5, 0.25)

        var rawColourTexture = colourTexture.image

        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['lights'],
                {
                    'terrainColors': {value: this.terrainColours, type: 'v4v'},
                    'magnitudeY': {type: 'f', value: this.yAmplitude},
                    'heightVariation': {type: 'f', value: 0.05},
                    'uTex': {value: null},
                    'cTex': {value: null},
                    'ambientLightIntensity': {type: 'f', value: 0.2},
                    'blendRatio': {type: "t", value: 0.1}
                }
            ]),
            lights: true,
            vertexShader: this.VertShader.getText(),
            fragmentShader: this.FragShader.getText()
 
        })

        this.material.uniforms.uTex.value = rawHeightTexture
        this.material.uniforms.cTex.value = rawColourTexture
        // this.material.uniforms.uTex.value.magFilter = THREE.NearestFilter
        // this.material.uniforms.uTex.value.minFilter = THREE.NearestFilter
        this.material.uniforms.uTex.value.needsUpdate = true
        this.material.uniforms.cTex.value.needsUpdate = true
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        console.log(this.mesh)
        return this.mesh
    }
}
