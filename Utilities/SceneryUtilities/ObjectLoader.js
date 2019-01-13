const treeArgs = [
    {
        angle: {x: 25, y: 120, z: 15},
        leafAngle: {x: 22.5, y: 22.5, z: 22.5},
        stochasticSymbols: {
            'a': 0.5,
            'b': 0.25
        },
        forwardMovement: 30,
        leafLength: 0.1,
        branchWidth: 5,
        iterations: 15,
        axiom: ['A'],
        rules: {
            0: {
                'A': "FA"
            },
            1: {
                'A': "F[X]=[Y]=[X]"
            },
            global: {
                "X": "<(b{^[FX]}b{[FX]&--[FX]}a{^[FY]--[FY]})>",
                "Y": "<(a{&[FX]}a{^^[FY]+&[FY]})>"
            },
            final: {
                'X': "--[/`[-f+f+f-|-f+f+f]`]++[/`[-f+f+f-|-f+f+f]`]^^--[/`[-f+f+f-|-f+f+f]`]++[/`[-f+f+f-|-f+f+f]`]",
                "Y": "-[/`[-f+f+f-|-f+f+f]`]++[/`[-f+f+f-|-f+f+f]`]^^--[/`[-f+f+f-|-f+f+f]`]++[/`[-f+f+f-|-f+f+f]`]"
            }
        },
        lengths: [
            1.0,
            0.5,
            0.45,
            0.4,
            0.35,
            0.3,
            0.25,
            0.2,
            0.2,
            0.2,
            0.2

        ],
        widths: [
            1.0,
            0.8,
            0.6,
            0.5,
            0.3,
            0.2,
            0.1,
            0.05,
            0.05,
            0.05,
        ]
    }
]

function LoadObjects() {
    const placementArgs = {
        "worldSize": worldSize,
        "bufferZone": 20,
    }

    var Tree1 = new TreeLoader(
        treeArgs[0],
        1,
        {
            sphereRes: 10,
            cRes: 10,
            bUV:
            [
                new THREE.Vector2(0.1, 1),
                new THREE.Vector2(1.0, 1.0),
                new THREE.Vector2(1.0, 0.1)
            ],
            lUV: 
            [
                new THREE.Vector2(0.0, 0.9),
                new THREE.Vector2(0.0, 0.0),
                new THREE.Vector2(0.9, 0.0)
            ],
            nUV:
            [
                new THREE.Vector2(0.5, 1),
                new THREE.Vector2(1.0, 1.0),
                new THREE.Vector2(1.0, 0.5)
            ]
        }
    )

    Tree1.spawnTrees()
    var texture = new THREE.TextureLoader().load("Textures/Tree.png")
    Tree1.addTrees(new THREE.MeshLambertMaterial({map: texture}))
    Tree1.placeTrees(BasicObjectPlacer, placementArgs)
    Tree1.addToScene(scene)
}
