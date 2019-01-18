// Provides an easier way of getting map data for use in object placement, and later for gradient maps
// Original goal was to use raycasting, but this was too slow

class MapTools {
    constructor(worldSize, amplitude, terrain, sf) {
        this._map = []
        this.adjWorldSize = worldSize * sf
        this.lsf = 1 / sf
        this.amplitude = amplitude
        this._sf = terrain.scaleFactor()
        this._mapDat = terrain.cleanData()
        this._depth = terrain.segments
    }

    makeMap() {
        let lx
        let ly

        let hx
        let hy

        let mx
        let my

        let dx
        let dy

        let a
        let b
        let c
        let d
        for (var x = 0; x < this.adjWorldSize; x++) {
            let temp = []
            for (var y = 0; y < this.adjWorldSize; y++) {
                lx = x / this._sf
                ly = y / this._sf

                mx = THREE.Math.clamp(Math.floor(lx), 0, this._depth - 1)
                my = THREE.Math.clamp(Math.floor(ly), 0, this._depth - 1)

                hx = THREE.Math.clamp(Math.ceil(lx), 0, this._depth - 1)
                hy = THREE.Math.clamp(Math.ceil(ly), 0, this._depth - 1)

                a = this._mapDat[mx][my]
                b = this._mapDat[hx][my]
                c = this._mapDat[mx][hy]
                d = this._mapDat[hx][hy]

                dx = mx - lx
                dy = my - ly

                temp.push(biLerp(a, b, c, d, dx, dy))
            }
            this._map.push(temp)
        }
    }

    drawHelper() {
        // Map tools helper geometry
        var mTHG = new THREE.SphereGeometry(2, 10, 10)
        // Temporary geometry
        var tG
        for (var [x, nodeL] of this._map.entries()) {
            for (var [y, node] of nodeL.entries()) {
                tG = new THREE.SphereGeometry(2, 10, 10)
                tG.translate((x - (this.adjWorldSize / 2)) * this.lsf, node * this.amplitude, (y  - (this.adjWorldSize / 2)) * this.lsf)
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