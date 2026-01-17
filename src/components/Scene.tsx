'use client';

import { StarField } from './canvas/StarField';

export const Scene = ({ children }: { children: React.ReactNode }) => {
    return (
        <group>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={2.5} />
            <directionalLight position={[-5, 5, 5]} intensity={1.0} />
            <StarField />
            {children}
        </group>
    );
};
