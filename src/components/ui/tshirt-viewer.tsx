import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Decal, Environment, ContactShadows, Center, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface TShirtViewerProps {
  color: string;
  logoUrl: string | null;
}

function PremiumProceduralShirt({ color, logoUrl }: TShirtViewerProps) {
  const fallbackTexture = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const logoTexture = useTexture(logoUrl || fallbackTexture);

  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.85,
    metalness: 0.1,
  });

  return (
    <group dispose={null} position={[0, 0.2, 0]}>
      {/* Torso - capsule for organic rounded soft edges */}
      <mesh castShadow receiveShadow position={[0, -0.2, 0]} scale={[1.1, 1.0, 0.4]} material={material}>
        <capsuleGeometry args={[0.5, 0.5, 32, 64]} />
        {logoUrl && (
          <Decal
            position={[0, 0.3, 0.5]} // Center chest
            rotation={[0, 0, 0]}
            scale={[0.4, 0.4, 0.4]}
          >
            <meshStandardMaterial
              map={logoTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>
        )}
      </mesh>

      {/* Left Sleeve */}
      <mesh castShadow receiveShadow position={[-0.7, 0.35, 0]} rotation={[0, 0, Math.PI / 3.5]} material={material}>
        <capsuleGeometry args={[0.22, 0.3, 32, 32]} />
      </mesh>

      {/* Right Sleeve */}
      <mesh castShadow receiveShadow position={[0.7, 0.35, 0]} rotation={[0, 0, -Math.PI / 3.5]} material={material}>
        <capsuleGeometry args={[0.22, 0.3, 32, 32]} />
      </mesh>

      {/* Neck collar */}
      <mesh castShadow receiveShadow position={[0, 0.53, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.2, 0.06, 32, 64]} />
      </mesh>

      {/* Bottom Hem (slightly widens the base of the capsule) */}
      <mesh castShadow receiveShadow position={[0, -0.9, 0]} scale={[1.15, 0.1, 0.42]} material={material}>
         <cylinderGeometry args={[0.48, 0.5, 2, 64]} />
      </mesh>
    </group>
  );
}

function SpinningShowcase({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Rotate completely around the Y-axis smoothly
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return <group ref={groupRef}>{children}</group>;
}

function Pedestal() {
  const material = new THREE.MeshStandardMaterial({
    color: '#888888',
    roughness: 0.9,
    metalness: 0.2,
  });

  return (
    <group position={[0, -1.3, 0]}>
      {/* Main Pedestal Base */}
      <mesh receiveShadow material={material}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 64]} />
      </mesh>
      {/* Small detailing block in the front */}
      <mesh position={[0, 0.1, 1.45]} material={material}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
      </mesh>
    </group>
  );
}

export default function TShirtViewer({ color, logoUrl }: TShirtViewerProps) {
  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ position: [0, 0.2, 3.5], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <spotLight 
          intensity={1.5} 
          angle={0.4} 
          penumbra={1} 
          position={[5, 10, 8]} 
          castShadow 
          shadow-bias={-0.0001}
        />
        <spotLight 
          intensity={0.8} 
          angle={0.5} 
          penumbra={1} 
          position={[-5, 5, -5]} 
        />
        <Environment preset="studio" />
        
        <Suspense fallback={null}>
          <Center position={[0, 0.2, 0]}>
            <SpinningShowcase>
              <PremiumProceduralShirt color={color} logoUrl={logoUrl} />
            </SpinningShowcase>
          </Center>
          <Pedestal />
        </Suspense>

        <ContactShadows position={[0, -1.19, 0]} opacity={0.6} scale={4} blur={2.5} far={2} />
      </Canvas>
    </div>
  );
}
