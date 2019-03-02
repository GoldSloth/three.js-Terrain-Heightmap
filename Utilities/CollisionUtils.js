function Collider(position, colliders, playerHeight) {
    this.position = position;
    this.playerHeight = playerHeight;
    
    this.update = function(delta) {
        var h = GetHeight(position)
        var resultant = 0;
        
        if (h >= 0) {
            var playerDistanceFromIntersection = h - playerHeight
            
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
