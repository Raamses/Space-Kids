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
        uColorPrimary: new THREE.Color("#ffaa00"),
        uColorSecondary: new THREE.Color("#ff4400"),
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

    // Simplex Noise Function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }

    void main() {
      // Sample the texture (Sunspots + Base Color)
      vec4 texColor = texture2D(uTexture, vUv);

      // Noise for "Heat Haze" (slower and larger scale than before)
      float noiseVal = snoise(vPosition * 1.5 + uTime * 0.1);
      
      // Hybrid Mixing Logic:
      // Start with the texture color
      vec3 color = texColor.rgb;
      
      // Add "Plasma Pulse" on top, but weighted by the texture's red channel
      // This ensures dark sunspots (low Red) stay dark, while bright areas get brighter
      color += uColorPrimary * noiseVal * 0.3 * texColor.r;
      
      // Add Fresnel for rim light
      float viewDir = dot(vNormal, vec3(0.0, 0.0, 1.0));
      float fresnel = pow(1.0 - abs(viewDir), 2.0);
      color += vec3(0.9, 0.5, 0.2) * fresnel;

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
