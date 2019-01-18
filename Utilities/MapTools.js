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
}