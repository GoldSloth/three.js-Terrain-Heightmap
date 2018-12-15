const treeArgs = [
    {
        angle: {x: 30, y: 90, z: 30},
        leafAngle: {x: 22.5, y: 22.5, z: 22.5},
        forwardMovement: 15,
        leafLength: 0.25,
        branchWidth: 6,
        iterations: 4,
        axiom: ['X'],
        rules: {
            global: {
                'X': '[F[=+<X>][=-<X>]]=[F[=+<X>][=-<X>]]F<X>',
                'F': 'FF'
            },
            final: {
                'X': '[/`[-f+f+f-|-f+f+f]`]'
            }
        },
        lengths: [
            1,
            0.9,
            0.8,
            0.7,
            0.6,
            0.5,
            0.4,
            0.3
        ],
        widths: [
            1,
            0.4,
            0.2,
            0.1,
            0.05,
            0.025,
            0.0125,
            0.006,
            0.003,
            0.0015
        ],
    }
]

function LoadObjects() {
    var Tree1 = new TreeLoader(treeArgs[0], 1)

    Tree1.spawnTrees()
}