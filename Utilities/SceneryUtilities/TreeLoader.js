class TreeLoader {
    constructor(args, instances) {
        this.treeArgs = args
        this.instances = instances
        this.trees = []
    }
    
    spawnTrees() {
        for (var i = 0; i < this.instances; i++) {
            this.trees.push(new Tree(this.treeArgs))
            this.trees[i].requestTree()
        }

    }

    addTrees(scene, material) {
        this.trees.forEach(function(item) {
            scene.add(new THREE.Mesh(item.geom, material))
        })
    }
}