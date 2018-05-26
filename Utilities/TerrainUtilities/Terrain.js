function Terrain(heightMap) {
    this.originalHeightMap = heightMap
    this.heightMap = this.originalHeightMap
    
    this.changeRes = function(newResX, newResY) {
        var changeX = (this.originalHeightMap.length/newResX)
        var changeY = (this.originalHeightMap[0].length/newResY)
        this.heightMap = []
        for (var x=0; x<this.originalHeightMap.length; x+= changeX) {
            var temp = []
            for (var y=0; y<this.originalHeightMap[0].length; y+= changeY) {
                temp.push(this.originalHeightMap[Math.floor(x)][Math.floor(y)])
            }
            this.heightMap.push(temp)
        }
        console.log(this.heightMap.length)
        console.log(this.heightMap[0].length)
    }
    
    this.changeMultiplier = function(multiplier) {
        for (var x=0; x<this.heightMap.length; x++) {
           for (var y=0; y<this.heightMap[0].length; y++) {
                this.heightMap[x][y] *= multiplier
            } 
        }
        console.log('Res changed')
    }
    
    this.draw = function() {
        console.log('Starting draw')
        console.log(this.heightMap)
        this.maxValue = 0
        this.minValue = 0
        for (var x=0; x<this.heightMap.length; x++) {
            for (var y=0; y<this.heightMap[0].length; y++) {
                if (this.heightMap[x][y] > this.maxValue) {
                    this.maxValue = this.heightMap[x][y]
                }
                if (this.heightMap[x][y] < this.minValue) {
                    this.minValue = this.heightMap[x][y]
                }
            } 
        }
        
        
        
        for (var x=0; x<this.heightMap.length-1; x++) {
            for (var y=0; y<this.heightMap[0].length-1; y++) {
                var bgeom = new THREE.BufferGeometry()
                var geom = new THREE.Geometry()
               
                geom.vertices[0] = (new THREE.Vector3(x, this.heightMap[x][y], y))
                geom.vertices[1] = (new THREE.Vector3(x+1, this.heightMap[x+1][y], y))
                geom.vertices[2] = (new THREE.Vector3(x, this.heightMap[x][y+1], y+1))
                geom.vertices[3] = (new THREE.Vector3(x+1, this.heightMap[x+1][y], y))
                geom.vertices[4] = (new THREE.Vector3(x+1, this.heightMap[x+1][y+1], y+1))
                geom.vertices[5] = (new THREE.Vector3(x, this.heightMap[x][y+1], y+1))
                
                for (var i=0; i<geom.vertices.length; i++) {
                    geom.vertices[i].multiply(new THREE.Vector3(10, 1, 10))
                }
                
                geom.faces.push(new THREE.Face3(0, 1, 2))
                geom.faces.push(new THREE.Face3(3, 4, 5))

                geom.computeFaceNormals();
                geom.computeVertexNormals();
                
                bgeom.fromGeometry(geom.clone())
                
                var meanVector = new THREE.Vector3(0, 0, 0)
                for (var i=0; i < geom.vertices.length; i++) {
                    meanVector.add(geom.vertices[i])
                }
                meanVector.divideScalar(geom.vertices.length)
                var meanHeight = meanVector.y/this.maxValue;
                for (var i=0; i<terrainProfile.length; i++){
                    if (meanHeight < terrainProfile[i].level) {
                        var color = new THREE.Color(terrainProfile[i].colour.toString())
                        break;
                    }
                }
                
                delete object
                var material = new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: color})
                var object = new THREE.Mesh(geom, material);
                object.renderOrder = 0
                object.material.color = color
                object.name = 'terrainmesh'
                scene.add(object)
            }
        }
    }
}