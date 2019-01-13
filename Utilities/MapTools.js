// Provides an easier way of getting map data for use in object placement, and later for gradient maps
// Original goal was to use raycasting, but this was too slow

class MapTools {
    constructor(worldSize, amplitude, terrain) {
        this._map = []
        this.worldSize = worldSize    
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
        for (var x = 0; x < this.worldSize; x++) {
            let temp = []
            for (var y = 0; y < this.worldSize; y++) {
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

        console.log(this._map)
    }

}