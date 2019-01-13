// Specialised rendering class

class TreeLoader {
    constructor(args, instances, gArgs) {
        this.treeArgs = args
        this.instances = instances
        this.trees = []
        this.gArgs = gArgs
    }
    
    spawnTrees() {
        for (var i = 0; i < this.instances; i++) {
            this.trees.push(new Tree(this.treeArgs, this.gArgs))
            this.trees[i].requestTree()
        }

    }

    addTrees(material) {
        for (var tree of this.trees) {
            tree.treeMesh = new THREE.Mesh(tree.geometry, material)
        }
    }

    addToScene(scene) {
        for (var tree of this.trees) {
            scene.add(tree.treeMesh)
        }
    }

    placeTrees(program, perams) {
        this.treePositions = []
        for (var tree of this.trees) {
            var newPos = program(this.treePositions, perams)
            this.treePositions.push(newPos)
            tree.treeMesh.position.add(newPos)
        }
    }
}