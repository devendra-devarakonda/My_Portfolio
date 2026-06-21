"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function WireframeSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.05;
      ref.current.rotation.y += delta * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={[2, 0, -3]}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial color="#FF2B4D" wireframe opacity={0.08} transparent />
    </mesh>
  );
}

function FloatingRings() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = Math.sin(t * 0.3) * 0.5;
      ring1.current.rotation.z = t * 0.15;
    }
    if (ring2.current) {
      ring2.current.rotation.y = t * 0.12;
      ring2.current.rotation.x = Math.cos(t * 0.2) * 0.4;
    }
    if (ring3.current) {
      ring3.current.rotation.z = -t * 0.1;
      ring3.current.rotation.y = Math.sin(t * 0.25) * 0.3;
    }
  });

  return (
    <>
      <mesh ref={ring1} position={[0, 0, -2]}>
        <torusGeometry args={[3, 0.02, 16, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent />
      </mesh>
      <mesh ref={ring2} position={[1, -0.5, -1]}>
        <torusGeometry args={[2.2, 0.015, 16, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.07} transparent />
      </mesh>
      <mesh ref={ring3} position={[-1, 0.5, -3]}>
        <torusGeometry args={[4, 0.01, 16, 64]} />
        <meshBasicMaterial color="#FF2B4D" opacity={0.06} transparent />
      </mesh>
    </>
  );
}

function GlowingParticles() {
  const ref = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.6) {
        cols[i * 3] = 1;
        cols[i * 3 + 1] = 0.17;
        cols[i * 3 + 2] = 0.3;
      } else {
        cols[i * 3] = 1;
        cols[i * 3 + 1] = 1;
        cols[i * 3 + 2] = 1;
      }
    }
    return cols;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function AmbientLight() {
  const ref = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.3) * 5;
      ref.current.position.y = Math.cos(t * 0.2) * 3;
    }
  });
  return <pointLight ref={ref} color="#FF2B4D" intensity={0.5} distance={15} />;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.1} />
        <AmbientLight />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <WireframeSphere />
        </Float>
        <FloatingRings />
        <GlowingParticles />
      </Canvas>
    </div>
  );
}
