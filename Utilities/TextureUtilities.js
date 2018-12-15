class RGBUInt8PerlinTexture {
    constructor(size) {
        this.size = size
        this._data = new Float32Array(size.x * size.y * 3)
        this._data.fill(0)
    }

    makeFirstLayer(frequency, amplitude) {
        let ns = 0
        let slide = 0
        var currentPerlin = new SimplexNoise(Math.random())
        for (var x = 0; x <= this.size.x; x++) {
            for (var y = 0; y <= this.size.y; y++) {
                ns = ((currentPerlin.noise2D(x/frequency, y/frequency) + 1) / 2) * amplitude
                slide = 3 * (x + (this.size.x * y))
                this._data[slide] = ns
                this._data[slide + 1] = ns
                this._data[slide + 2] = ns
            }
        }
    }

    makeNewLayer(frequency, amplitude) {
        let ns = 0
        let slide = 0
        let currentPerlin = new SimplexNoise(Math.random())
        for (var x = 0; x <= this.size.x; x++) {
            for (var y = 0; y <= this.size.y; y++) {
                ns = currentPerlin.noise2D(x/frequency, y/frequency) * (amplitude / 2)
                slide = 3 * (x + (this.size.x * y))
                this._data[slide] += ns
                this._data[slide + 1] += ns
                this._data[slide + 2] += ns
            }
        }
    }

    _MakeImageArray() {
        this._UintData = new Uint8Array(this.size.x * this.size.y * 3)
        this._data.forEach(function(value, index) {
            this._UintData[index] = value * 255
        }, this)
        return  this._UintData
    }

    get imageArray() {
        return this._MakeImageArray()
    }

    get image() {
        this._MakeImageArray()
        return new THREE.DataTexture(this._UintData, this.size.x, this.size.y, THREE.RGBFormat, THREE.UnsignedByteType)
    }

}