function Terrain(heightMap) {
    this.originalHeightMap = heightMap
    this.heightMap = this.originalHeightMap
    
    this.scaleX = 1
    this.scaleY = 1
    
    this.changeRes = function(newResX, newResY) {
        var changeX = (this.originalHeightMap.length/newResX)
        var changeY = (this.originalHeightMap[0].length/newResY)
        this.heightMap = []
        for (var x=0; x<this.originalHeightMap.length-1; x+= changeX) {
            var temp = []
            for (var y=0; y<this.originalHeightMap[0].length-13; y+= changeY) {
                if (x%1 != 0 || y%1 != 0) {
                    var total = 0
                    total += this.originalHeightMap[Math.ceil(x)][Math.ceil(y)]
                    total += this.originalHeightMap[Math.ceil(x)][Math.floor(y)]
                    total += this.originalHeightMap[Math.floor(x)][Math.ceil(y)]
                    total += this.originalHeightMap[Math.floor(x)][Math.floor(y)]
                    temp.push(total/4)
                } else {
                    temp.push(this.originalHeightMap[x][y])
                }
            }
            this.heightMap.push(temp)
        }
    }
    
    this.smoothingFilter = function(mix) {
        for (var x=1; x<this.heightMap.length-1; x++) {
            for (var y=1; y<this.heightMap[0].length-1; y++) {
                var mean = this.heightMap[x][y]
                mean += this.heightMap[x+1][y]
                mean += this.heightMap[x-1][y]
                mean += this.heightMap[x][y+1]
                mean += this.heightMap[x][y-1]
                mean /= 5
                this.heightMap[x][y] = (mean*mix) + (this.heightMap[x][y]*(1-mix))
            }
        }
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
        
        var material = new THREE.MeshLambertMaterial({side: THREE.BackSide, vertexColors: THREE.FaceColors})
        var geom = new THREE.Geometry()
        
        var counter = 0
        
        for (var x=0; x<this.heightMap.length-1; x++) {
            for (var y=0; y<this.heightMap[0].length-1; y++) {
                
                var vertices = []
                
                vertices[0] = (new THREE.Vector3(x, this.heightMap[x][y], y))
                vertices[1] = (new THREE.Vector3(x+1, this.heightMap[x+1][y], y))
                vertices[2] = (new THREE.Vector3(x, this.heightMap[x][y+1], y+1))
                vertices[3] = (new THREE.Vector3(x+1, this.heightMap[x+1][y], y))
                vertices[4] = (new THREE.Vector3(x+1, this.heightMap[x+1][y+1], y+1))
                vertices[5] = (new THREE.Vector3(x, this.heightMap[x][y+1], y+1))
                
                for (var i=0; i<vertices.length; i++) {
                    vertices[i].multiply(new THREE.Vector3(scaleX, 1, scaleY))
                }
                
                var mean1 = new THREE.Vector3(0,0,0)
                var mean2 = new THREE.Vector3(0,0,0)
                
                for (var i=0; i<3; i++) {
                    mean1.add(vertices[i])
                }
                for (var i=3; i<6; i++) {
                    mean2.add(vertices[i])
                }
                mean1.divideScalar(3)
                mean2.divideScalar(3)
                
                for (var i=0; i<vertices.length; i++) {
                    geom.vertices[i+counter] = vertices[i]
                }
                
                var meanHeight1 = (mean1.y-this.minValue)/this.maxValue
                var meanHeight2 = (mean2.y-this.minValue)/this.maxValue
                             
                for (var i=0; i<terrainProfile.length; i++){
                    if (meanHeight1 < terrainProfile[i].level) {
                        var color1 = new THREE.Color(terrainProfile[i].colour.toString())
                        break;
                    }
                }
                
                for (var i=0; i<terrainProfile.length; i++){
                    if (meanHeight2 < terrainProfile[i].level) {
                        var color2 = new THREE.Color(terrainProfile[i].colour.toString())
                        break;
                    }
                }
                             
                geom.faces.push(new THREE.Face3(0+counter, 1+counter, 2+counter))
                geom.faces.push(new THREE.Face3(3+counter, 4+counter, 5+counter))
                geom.faces[counter/3].color = color1.clone()
                geom.faces[(counter/3)+1].color = color2.clone()
                counter += 6
            }
        }
        
        geom.computeFaceNormals();
        geom.computeVertexNormals();
        geom.computeBoundingSphere()
        geom.computeBoundingBox()

        var object = new THREE.Mesh(geom, material);
        object.name = 'terrainmesh'
        scene.add(object)
    }
}