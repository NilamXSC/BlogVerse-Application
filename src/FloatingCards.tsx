import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function FloatingShape({ position, color, speed, distort }: { 
  position: [number, number, number]; 
  color: string;
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * speed * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.8}
          distort={distort}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function FloatingTorus({ position, color }: { 
  position: [number, number, number]; 
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={meshRef} position={position}>
        <torusGeometry args={[0.8, 0.3, 16, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

function GlowingSphere({ position, color }: { 
  position: [number, number, number]; 
  color: string;
}) {
  return (
    <Float speed={3} rotationIntensity={0.2} floatIntensity={3}>
      <mesh position={position}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </Float>
  );
}

export const FloatingCards = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a0a0a0" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#6b7280" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#94a3b8"
        />

        {/* Floating shapes */}
        <FloatingShape position={[-4, 2, -2]} color="#4a5568" speed={0.5} distort={0.3} />
        <FloatingShape position={[4, -1, -3]} color="#64748b" speed={0.3} distort={0.4} />
        <FloatingTorus position={[-3, -2, -4]} color="#475569" />
        <FloatingTorus position={[3, 3, -5]} color="#6b7280" />
        <GlowingSphere position={[0, 2, -2]} color="#94a3b8" />
        <GlowingSphere position={[-2, -1, -3]} color="#71717a" />
        <GlowingSphere position={[2, 0, -4]} color="#78716c" />
      </Canvas>
    </div>
  );
};
