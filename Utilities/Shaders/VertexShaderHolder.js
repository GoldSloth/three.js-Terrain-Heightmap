class VertexShader {
    constructor() {
        this.rawText = `
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vectorPos;

        varying vec2 vUv;
        void main()
        {
            vUv = uv;
            vectorPos = (modelViewMatrix * vec4(position, 1.0)).xyz;
            vPosition = position;
            vNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`
    }
    getText() {
        return this.rawText
    }
}
