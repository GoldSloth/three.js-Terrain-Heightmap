function player(rot, initX, initY, initZ, model) {
    this.x = initX;
    this.y = initY;
    this.z = initZ;
    this.move = function(x, y, z) {
        this.x += x;
        this.y += y;
        this.z += z;
    }
    this.setPosition = function(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}