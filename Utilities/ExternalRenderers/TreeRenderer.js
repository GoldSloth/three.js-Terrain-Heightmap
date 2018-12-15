class Tree {
    constructor(args) {
        this.args = args
        this.loaded = false
    }

    makeGeometry() {
        this.drawNodes()
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
        xmlhttp.open("POST", "https://tranquil-sands-18396.herokuapp.com", true)

        xmlhttp.setRequestHeader("Access-Control-Allow-Origin", "*")
        xmlhttp.setRequestHeader("Access-Control-Allow-Credentials", "true")
        xmlhttp.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
        xmlhttp.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method")
        
        xmlhttp.setRequestHeader("Content-Type", "application/json")
        console.log(this.args)
        xmlhttp.send(JSON.stringify(this.args))
    }

    drawNodes() {
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
    }

    drawBranches() {

    }

    drawLeaves() {

    }

}