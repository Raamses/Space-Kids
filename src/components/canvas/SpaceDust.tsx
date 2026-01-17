import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpaceDust({ count = 500, radius = 50 }: { count?: number; radius?: number }) {
    const mesh = useRef<THREE.Points>(null);

    // Generate random points in a sphere
    const particles = useMemo(() => {
        const temp = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const theta = THREE.MathUtils.randFloatSpread(360);
            const phi = THREE.MathUtils.randFloatSpread(360);

            // Distribute randomly but avoid the very center (Sun)
            const r = THREE.MathUtils.randFloat(10, radius);

            const x = r * Math.sin(theta) * Math.cos(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(theta);

            temp[i * 3] = x;
            temp[i * 3 + 1] = y;
            temp[i * 3 + 2] = z;
        }
        return temp;
    }, [count, radius]);

    useFrame((state, delta) => {
        if (mesh.current) {
            // Slow constant rotation for parallax feel
            mesh.current.rotation.y += delta * 0.02;
            mesh.current.rotation.x += delta * 0.01;
        }
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    args={[particles, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.15}
                color="#88ccff" // Soft blue/purple
                transparent
                opacity={0.6}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    );
}
