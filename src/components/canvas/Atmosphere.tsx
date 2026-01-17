'use client';

import { AdditiveBlending, BackSide, Color } from 'three';

// Vertex Shader: Calculates the "rim" or fresnel effect
const vertexShader = `
varying vec3 vNormal;
void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader: Controls the glow color and intensity
const fragmentShader = `
varying vec3 vNormal;
uniform vec3 color;
uniform float intensity;
uniform float power;

void main() {
    float intensityTerm = pow(0.75 - dot(vNormal, vec3(0, 0, 1.0)), power);
    gl_FragColor = vec4(color, 1.0) * intensityTerm * intensity;
}
`;

interface AtmosphereProps {
    color?: string;
    scale?: number;
    opacity?: number;
}

export const Atmosphere = ({ color = "#00aaff", scale = 1.2, opacity = 1.0 }: AtmosphereProps) => {
    return (
        <mesh scale={[scale, scale, scale]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    color: { value: new Color(color) },
                    intensity: { value: opacity },
                    power: { value: 3.0 }
                }}
                blending={AdditiveBlending}
                side={BackSide}
                transparent
            />
        </mesh>
    );
};
