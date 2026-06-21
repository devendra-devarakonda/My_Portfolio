import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface SceneContentProps {
  isHovered: boolean;
  pulseTrigger: boolean;
  transitionState: 'entering' | 'exiting' | 'stable';
  categoryColor: string;
}

function SceneContent({ isHovered, pulseTrigger, transitionState, categoryColor }: SceneContentProps) {
  const cubeRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  const [pulseScale, setPulseScale] = useState(1);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [burstOpacity, setBurstOpacity] = useState(0);

  // Handle transition and burst animations
  useEffect(() => {
    if (transitionState === 'exiting') {
      // Accelerate rings, start charging
      setSpeedMultiplier(8); // spin fast
      setPulseScale(1.5);
    } else if (transitionState === 'entering') {
      // Massive burst
      setBurstOpacity(0.8);
      setPulseScale(2.5);
      
      const timer1 = setTimeout(() => {
        setBurstOpacity(0);
        setPulseScale(1);
        setSpeedMultiplier(1);
      }, 500);
      return () => clearTimeout(timer1);
    } else {
      setSpeedMultiplier(1);
    }
  }, [transitionState]);

  // Handle hover pulse trigger animation
  useEffect(() => {
    if (pulseTrigger && transitionState === 'stable') {
      setPulseScale(1.3);
      const timer = setTimeout(() => setPulseScale(1), 400);
      return () => clearTimeout(timer);
    }
  }, [pulseTrigger, transitionState]);

  // Generate particle positions inside/around the core
  const particleCount = 50;
  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.5 + u * 0.8; // distributed outside the inner core
      
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [particleCount]);

  const rotationRef = useRef({ x: 0, y: 0, ring1: 0, ring2: 0, partY: 0, partZ: 0 });

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Limit delta to prevent huge jumps on tab switch
    const safeDelta = Math.min(delta, 0.1);

    rotationRef.current.x += safeDelta * 0.08 * speedMultiplier;
    rotationRef.current.y += safeDelta * 0.15 * speedMultiplier;
    rotationRef.current.ring1 += safeDelta * 0.5 * speedMultiplier;
    rotationRef.current.ring2 += safeDelta * 0.4 * speedMultiplier;
    rotationRef.current.partY -= safeDelta * 0.2 * speedMultiplier;
    rotationRef.current.partZ += safeDelta * 0.1 * speedMultiplier;

    if (groupRef.current) {
      groupRef.current.rotation.y = rotationRef.current.y;
      groupRef.current.rotation.x = rotationRef.current.x;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.12;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = rotationRef.current.ring1;
      ring1Ref.current.rotation.y = rotationRef.current.ring1 * 0.5;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = rotationRef.current.ring2;
      ring2Ref.current.rotation.z = rotationRef.current.ring2 * 0.7;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = rotationRef.current.partY;
      particlesRef.current.rotation.z = rotationRef.current.partZ;
    }

    if (cubeRef.current) {
      const targetScale = isHovered ? 1.1 * pulseScale : 1.0 * pulseScale;
      cubeRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }

    if (sphereRef.current) {
      const breathing = 0.5 + Math.sin(t * 3.5) * 0.05;
      const hoverPulse = isHovered ? 1.25 : 1.0;
      const totalSphereScale = breathing * hoverPulse * (pulseScale > 1 ? 1.5 : 1.0);
      sphereRef.current.scale.lerp(new THREE.Vector3(totalSphereScale, totalSphereScale, totalSphereScale), 0.15);
    }

    if (pulseRingRef.current) {
      if (burstOpacity > 0) {
        pulseRingRef.current.scale.addScalar(safeDelta * 8);
        const mat = pulseRingRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.1);
      } else {
        pulseRingRef.current.scale.set(0.1, 0.1, 0.1);
        (pulseRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
      }
    }

    const mouseX = state.mouse.x * 0.6;
    const mouseY = state.mouse.y * 0.6;
    state.camera.position.x += (mouseX - state.camera.position.x) * 0.05;
    state.camera.position.y += (mouseY - state.camera.position.y) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      {/* Layer 1: Removed crystal shell to enhance energy core feel */}

      {/* Layer 2: Inner Glowing Core Sphere */}
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={categoryColor}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      {/* Layer 3: Orbital Rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[0.65, 0.015, 32, 100]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={categoryColor} 
          emissiveIntensity={2} 
          toneMapped={false} 
          transparent 
          opacity={0.8} 
        />
      </mesh>
      <mesh ref={ring2Ref}>
        <torusGeometry args={[0.8, 0.015, 32, 100]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={categoryColor} 
          emissiveIntensity={2} 
          toneMapped={false} 
          transparent 
          opacity={0.6} 
        />
      </mesh>

      {/* Layer 4: Floating Particles (Sparks) */}
      <Points ref={particlesRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color={categoryColor}
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </Points>

      {/* Layer 5: Burst Pulse Wave */}
      <mesh ref={pulseRingRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={categoryColor}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric Core Aura Glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial
          color={categoryColor}
          transparent
          opacity={isHovered ? 0.2 : 0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface TechCubeProps {
  isHovered: boolean;
  pulseTrigger: boolean;
  transitionState: 'entering' | 'exiting' | 'stable';
  categoryColor: string;
}

export default function TechCube({ isHovered, pulseTrigger, transitionState, categoryColor }: TechCubeProps) {
  return (
    <div className="canvas-container select-none">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
        dpr={[1, 2]}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
        <pointLight position={[0, 0, 0]} intensity={3.5} color={categoryColor} distance={5} />
        
        <SceneContent 
          isHovered={isHovered} 
          pulseTrigger={pulseTrigger} 
          transitionState={transitionState}
          categoryColor={categoryColor}
        />
      </Canvas>
    </div>
  );
}
