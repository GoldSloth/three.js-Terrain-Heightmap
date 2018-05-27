var Key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    SPACE: 32,
    SHIFT: 16,
    
    isDown: function(keyCode) {
        return this._pressed[keyCode];
    },

    onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
    },

    onKeyup: function(event) {
        delete this._pressed[event.keyCode];
    }
}

function calculateMovement() {
    const speed = 0.08
    if (Key.isDown(Key.UP) || Key.isDown(Key.W)) {
        velocity.z -= 1.7 * speed
    }
    if (Key.isDown(Key.DOWN) || Key.isDown(Key.S)) {
        velocity.z += 1 * speed
    }
    if (Key.isDown(Key.LEFT) || Key.isDown(Key.A)) {
        velocity.x -= 1 * speed
    }
    if (Key.isDown(Key.RIGHT) || Key.isDown(Key.D)) {
        velocity.x += 1 * speed
    }
    
    if (Key.isDown(Key.SPACE)) {
        velocity.y += 20 * speed
    }
    
    if (Key.isDown(Key.SHIFT)) {
        velocity.multiplyScalar(1.5)
    }
}

