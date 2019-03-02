// Provides an easier way of getting map data for use in object placement, and later for gradient maps
// Original goal was to use raycasting, but this was too slow

function isInt(value) {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

class MapTools {
    constructor(worldSize, amplitude, terrain, sf) {
        this.map = []
        this.worldSize = worldSize
        this.localSize = sf
        this.amplitude = amplitude
        this.importedMapData = terrain.cleanData()
        this.importedSize = terrain.segments

        this._half = new THREE.Vector3(0.5, 0.5, 0.5)

        // Relative scales

        this.localToImported = this.importedSize / this.localSize
        this.localToWorld = this.worldSize / this.localSize
    }

    makeMap() {
        console.log(this.importedMapData)
        if (isInt(this.localToImported)) {
            for (var x = 0; x < this.localSize; x++) {
                var temp = []
                for (var y = 0; y < this.localSize; y++) {
                    temp.push(this.importedMapData[x * this.localToImported][y * this.localToImported])
                }
                this.map.push(temp)
            }
        } else {
            console.log("Ripperoni")
        }

        console.log(this.map)
    }

    drawHelper() {
        // Map tools helper geometry
        var mTHG = new THREE.SphereGeometry(4, 6, 6)
        // Temporary geometry
        var tG
        for (var x = 0; x < this.map.length; x++) {
            for (var y = 0; y < this.map[x].length; y++) {
                tG = new THREE.SphereGeometry(4, 6, 6)
                tG.translate(
                    ((this.localToWorld * x) - (this.worldSize / 2)),
                    ((1 - this.map[y][x]) * this.amplitude) - 30,
                    ((this.localToWorld * y) - (this.worldSize / 2))
                )
                mTHG.merge(tG)
            }
        }
        // Map tools helper geometry
        var mTHM = new THREE.MeshLambertMaterial({color: 0xff0055})
        // Map tools helper Mesh
        var mTHMESH = new THREE.Mesh(mTHG, mTHM)
        scene.add(mTHMESH)
    }

    getInterpHeight(real) {
        // (worldSize / 2) - ((u * worldSize)) => Real
        // real => 0.5 - r/Z 
        // (Something to put me off doing this)
        let u = this._half.sub(real.divideScalar(worldSize))
        
        let uv = u.multiplyScalar(this.localSize)

        let dx = uv.x % 1
        let dz = uv.z % 1

        let lx = uv.x - (uv.x % 1)
        let lz = uv.z - (uv.z % 1)

        let hx = uv.x + (1 - (uv.x % 1))
        let hz = uv.z + (1 - (uv.z % 1))

        let t0 = this.map[lx][lz] * (1 - dx) * (1 - dz)
        let t1 = this.map[hx][lz] * dx * (1 - dz)
        let t2 = this.map[lx][hz] * (1 - dx) * dz
        let t3 = this.map[hx][hz] * dx * dz

        return t0 + t1 + t2 + t3
    }
}
