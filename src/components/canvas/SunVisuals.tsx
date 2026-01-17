import { useRef, useLayoutEffect, forwardRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { PLANET_ASSETS } from '../../utils/assets';

// --- SHADERS ---

// 1. Plasma Surface Shader (Hybrid: Texture + Noise)
const SunSurfaceMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorPrimary: new THREE.Color("#ffdd00"), // Warmer Yellow
        uColorSecondary: new THREE.Color("#ff8800"), // Softer Orange
        uTexture: new THREE.Texture(), // Placeholder
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Simplified Noise (Value Noise instead of Simplex for perf)
    float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    float valueNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f*f*(3.0-2.0*f);
        return mix(mix(rand(i), rand(i + vec2(1.0, 0.0)), f.x),
                   mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), f.x), f.y);
    }

    void main() {
      // Sample the texture (Sunspots + Base Color)
      vec4 texColor = texture2D(uTexture, vUv);

      // Slower, simpler noise
      float noiseVal = valueNoise(vUv * 10.0 + uTime * 0.2);
      
      // Brighter mix
      vec3 color = mix(uColorSecondary, uColorPrimary, noiseVal);
      
      // Blend with texture, but don't let it get too black
      color = mix(color, texColor.rgb, 0.4);
      
      // Add Fresnel for friendly rim light
      float viewDir = dot(vNormal, vec3(0.0, 0.0, 1.0));
      float fresnel = pow(1.0 - abs(viewDir), 2.5);
      color += vec3(1.0, 0.8, 0.4) * fresnel; // Golden Glow

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// 2. Corona Glow Shader (Unchanged)
const SunCoronaMaterial = shaderMaterial(
    { uTime: 0, uColor: new THREE.Color("#ffaa00") },
    // Vert
    `
    varying float vIntensity;
    void main() {
      vec3 vNormal = normalize(normalMatrix * normal);
      // Flipped fresnel for back-side mesh
      vIntensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Frag
    `
    uniform float uTime;
    uniform vec3 uColor;
    varying float vIntensity;
    void main() {
      gl_FragColor = vec4(uColor, vIntensity * 1.5);
    }
  `
);

extend({ SunSurfaceMaterial, SunCoronaMaterial });

interface SunVisualsProps {
    onClick?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerDown?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerUp?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerMove?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerLeave?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOver?: (e: ThreeEvent<PointerEvent>) => void;
    onPointerOut?: (e: ThreeEvent<PointerEvent>) => void;
    scale?: number | [number, number, number];
}

export const SunVisuals = forwardRef<THREE.Mesh, SunVisualsProps>((props, ref) => {
    const surfaceMatRef = useRef<THREE.ShaderMaterial>(null);
    const coronaMatRef = useRef<THREE.ShaderMaterial>(null);

    // Load the 2K Sun Texture
    const texture = useTexture(PLANET_ASSETS.sun.map);

    // Configure texture wrapping for seamless sphere
    // Configure texture wrapping for seamless sphere
    useLayoutEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    }, [texture]);

    useFrame((state, delta) => {
        if (surfaceMatRef.current) (surfaceMatRef.current as unknown as THREE.ShaderMaterial & { uTime: number }).uTime += delta;
        if (coronaMatRef.current) (coronaMatRef.current as unknown as THREE.ShaderMaterial & { uTime: number }).uTime += delta;
    });

    return (
        <group>
            {/* 1. The Main Star (Interactive) */}
            <mesh ref={ref} {...props}>
                <sphereGeometry args={[2.5, 64, 64]} />
                {/* @ts-expect-error - Custom shader material */}
                <sunSurfaceMaterial
                    ref={surfaceMatRef}
                    uTexture={texture}
                    uColorPrimary={"#ffcc00"}
                    uColorSecondary={"#ff5500"}
                />
            </mesh>

            {/* 2. The Corona (Glow) */}
            <mesh scale={[3.2, 3.2, 3.2]}>
                <sphereGeometry args={[1, 64, 64]} />
                {/* @ts-expect-error - Custom shader material */}
                <sunCoronaMaterial
                    ref={coronaMatRef}
                    uColor={"#ffaa00"}
                    transparent
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
});

SunVisuals.displayName = "SunVisuals";
