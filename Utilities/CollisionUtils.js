function Collider(position, colliders, playerHeight) {
    this.position = position;
    this.colliders = colliders;
    this.playerHeight = playerHeight;
    this.raycaster = new THREE.Raycaster();
    this.intersections = [];
    
    this.checkDistance = function() {
        this.raycaster.set(this.position, (new THREE.Vector3(0, -1, 0)).normalize())
        this.intersections = this.raycaster.intersectObject(this.colliders, true)
    }  
    
    this.update = function(delta) {
        this.checkDistance()
        var resultant = 0;
        
        if(this.intersections.length > 0) {
            var playerDistanceFromIntersection = this.intersections[0].distance - playerHeight
            
            if(playerDistanceFromIntersection > gravity) {
                resultant = (-gravity * delta)
            } else if(playerDistanceFromIntersection > 0 && playerDistanceFromIntersection < gravity) {
                resultant = (-playerDistanceFromIntersection);
            } else if(playerDistanceFromIntersection < 0) {
                resultant = (-playerDistanceFromIntersection);
            }
        } else {
            resultant = (-gravity * delta);
        }
        return resultant
    }
}