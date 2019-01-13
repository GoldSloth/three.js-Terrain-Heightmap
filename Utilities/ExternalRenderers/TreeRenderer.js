// Exteral rendering script for tree

class Tree {
    constructor(args, gArgs) {
        this.args = args
        this.loaded = false
        this.gArgs = gArgs
    }

    makeGeometry() {
        this.makeNodes()
        this.makeBranches()
        this.makeLeaves()
        this.geometry = new THREE.Geometry()
        
        this.geometry.merge(this.lG)
        
        this.geometry.merge(this.sticks)

        this.geometry.merge(this.gN)
        
        this.loaded = true
    }

    _receiveTree(xmlhttp) {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            this.treeInfo = JSON.parse(xmlhttp.responseText)
            this.branches = this.treeInfo.branches
            this.leaves = this.treeInfo.leaves
            this.makeGeometry()
        }
    }

    requestTree() {
        var xmlhttp = new XMLHttpRequest()
        xmlhttp.onreadystatechange = this._receiveTree.bind(this, xmlhttp)
        xmlhttp.open("POST", "https://tranquil-sands-18396.herokuapp.com", false)

        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*")
        xmlhttp.setRequestHeader("Access-Control-Allow-Credentials", "true")
        xmlhttp.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
        xmlhttp.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method")
        
        xmlhttp.setRequestHeader("Content-Type", "application/json")
        xmlhttp.send(JSON.stringify(this.args))
    }

    makeNodes() {
        this.nodes = [{'position': new THREE.Vector3(0,0,0), 'size': 1}]
        var l0
        var size
        for (var x = 0; x < this.branches.length; x++) {
            l0 = new THREE.Vector3(this.branches[x].p0.x, this.branches[x].p0.y, this.branches[x].p0.z)
            size = this.branches[x].w
            var nodeFound = false
            for (var item of this.nodes) {
                if (item.position.x == l0.x && item.position.y == l0.y && item.position.z == l0.z) {
                    if (size < item.size) {
                        item.size = size
                    }
                    nodeFound = true
                    break
                }

            }

            if (!nodeFound) {
                this.nodes.push({'position': new THREE.Vector3(l0.x, l0.y, l0.z), 'size': size})
            }
        }

        this.gNodes = []
        for (var node of this.nodes) {
            this.gNodes.push(new THREE.SphereGeometry(node.size, this.gArgs.sphereRes, this.gArgs.sphereRes).translate(node.position.x, node.position.y, node.position.z))
        }

        this.gN = new THREE.Geometry()
        for (var node of this.gNodes) {
            this.gN.merge(node, node.matrix)
        }
        this.gN.faceVertexUvs[0] = []
        for (var face of this.gN.faces) {
            this.gN.faceVertexUvs[0].push(this.gArgs.nUV)
        }
    }

    makeBranches() {
        this.sticks = new THREE.Geometry()
        var cyl
        var l0
        var l1
        var rad2
        for (var branch of this.branches) {
            l0 = new THREE.Vector3(branch.p0.x, branch.p0.y, branch.p0.z)
            l1 = new THREE.Vector3(branch.p1.x, branch.p1.y, branch.p1.z)
        
            for (var node of this.nodes) {
                var isSame = (node.position.x == l1.x && node.position.y == l1.y && node.position.z == l1.z)
                if (isSame) {
                    rad2 = node.size
                    
                    break
                }
            }

            cyl = new Cylinder(l0, l1, branch.w, rad2, this.gArgs.cRes, true)         

            this.sticks.merge(cyl.makeGCylinder())
        }

        for (var face in this.sticks.faces) {
            this.sticks.faceVertexUvs[0].push(this.gArgs.bUV)
        }

        // scene.add(new THREE.Mesh(this.sticks, new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: new THREE.Color(0.6, 0.4, 0.3)})))
    }

    makeLeaves() {
        this.lG = new THREE.Geometry()
        var points = []
        for (var leaf of this.leaves) {
            
            points = []
            for (var point of leaf) {
                points.push(new THREE.Vector3(point.x, point.y, point.z))
            }

            this.lG.merge(new THREE.ConvexGeometry(points))
        }

        for (var face in this.lG.faces) {
            this.lG.faceVertexUvs[0].push(this.gArgs.lUV)
        }

        // scene.add(new THREE.Mesh(this.lG, new THREE.MeshLambertMaterial({side: THREE.DoubleSide, color: new THREE.Color(0.2, 1.0, 0.3)})))
    }

}
