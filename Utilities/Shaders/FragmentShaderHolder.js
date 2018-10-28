class FragmentShader {
    constructor(terrainColourProfile) {
        var amendment = "#define TERRAIN_COLOR_ARRAY_LENGTH " + terrainColourProfile.length + '\n'
        this.rawText = amendment + `
precision highp float;
varying vec3 vNormal;
varying vec3 vectorPos;
varying vec3 vPosition;
varying vec2 vUv;

uniform float magnitudeY;
uniform vec4 terrainColors[TERRAIN_COLOR_ARRAY_LENGTH];
uniform float heightVariation;

uniform sampler2D uTex;

#if NUM_DIR_LIGHTS > 0 
    struct DirectionalLight {
        vec3 direction;
        vec3 color;
        int shadow;
        float shadowBias;
        float shadowRadius;
        vec2 shadowMapSize;
    };
    uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
#endif

void main()
{
    vec4 addedLights = vec4(0.0, 0.0, 0.0, 1.0);
    if(NUM_DIR_LIGHTS > 0) {
        for(int l0 = 0; l0 < NUM_DIR_LIGHTS; l0++) {
            vec3 lightDirection = normalize(-directionalLights[l0].direction);
            addedLights.rgb += (clamp(dot(lightDirection, -vNormal), 0.0, 0.9) + 0.1) * directionalLights[l0].color;
        }
    }

    for (int l1 = 0; l1 < TERRAIN_COLOR_ARRAY_LENGTH; l1 ++) {
        float textureColour = texture2D(uTex, vUv).r - 0.5;
        if (terrainColors[l1].x < (vPosition.y/magnitudeY + (textureColour * heightVariation))) {
            gl_FragColor = vec4(terrainColors[l1].y, terrainColors[l1].z, terrainColors[l1].w, 1.0) * addedLights;
        }
    }
    
}`
    }
    getText() {
        return this.rawText
    }
}
// for (int l1 = 0; l1 < TERRAIN_COLOR_ARRAY_LENGTH; l1 ++) {
                
// if (terrainColors[l1].x < (vPosition.y/magnitudeY + (texture2D(noiseTexture, vUv).x * heightVariation))) {
//     gl_FragColor = vec4(terrainColors[l1].y, terrainColors[l1].z, terrainColors[l1].w, 1.0) * addedLights;
// }
//  }