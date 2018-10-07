class Terrain {
    constructor(size, segments, type, yAmplitude, seed, perlinModifier) {
        this.size = size
        this.segments = segments
        this.yAmplitude = yAmplitude

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
    }

    _makeFromPerlin(seed, perlinModifier) {
        var perlin1 = new SimplexNoise(seed)
        this.indices = []
        this.vertices = []
        this.normals = []
        this.colors = []

        var halfSize = this.size/2
        var segmentSize = this.size/this.segments

        for (var i = 0; i <= this.segments; i++) {
            var y = (i * segmentSize) - halfSize
            for (var j = 0; j <= this.segments; j++) {
                var x = (j * segmentSize) - halfSize
                this.vertices.push(x, perlin1.noise2D(x/perlinModifier, y/perlinModifier) * this.yAmplitude, y)

                this.normals.push(0 , 1, 0)
                // this.colors.push(1, 0, 1)
            }
        }
    }

    _makeFromImage() {
        // 
    }

    formNormalDistribution() {

    }

    formSecondPerlin() {

    }

    setColours(terrainStyle) {
        for (var i=1; i<this.vertices.length; i+=3) {
            var thisColor
            for (var j=0; j<terrainStyle.length; j++) {
                if (! (this.vertices[i] > terrainStyle[j])) {
                    thisColor = terrainStyle[j].colour
                }

                // This will only do anything meaningful if the data is in ascending order
            }
            var thisColor = new THREE.Color(thisColor)
            this.colors.push(thisColor.r, thisColor.g, thisColor.b)
            // this.colors.push(1, 0, 1)

        }
        // console.log(this.colors)
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
        this.geometry.addAttribute('color', new THREE.Float32BufferAttribute(this.colors, 3));

        this.geometry.computeVertexNormals()
        // this.geometry.computeFaceNormals()
        this.geometry.computeBoundingBox()
        this.geometry.computeBoundingSphere()

        this.material = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide, vertexColors: THREE.VertexColors
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        console.log(this.mesh)
        return this.mesh
    }
}