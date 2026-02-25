import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Icosahedron, Box, Sphere, Line } from '@react-three/drei'
import * as THREE from 'three'

// Mouse position tracker
function useMousePosition() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1
      })
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  return mouse
}

// Interactive node that responds to mouse
function InteractiveNode({ 
  position, 
  color = '#00F0FF',
  size = 0.15,
  mouse
}: { 
  position: [number, number, number]
  color?: string
  size?: number
  mouse: { x: number; y: number }
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    
    // Base rotation
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.5
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    
    // Mouse attraction effect
    const targetX = position[0] + mouse.x * 0.5
    const targetY = position[1] + mouse.y * 0.5
    
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05
    
    // Scale on hover
    const targetScale = hovered ? 1.5 : 1
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )
  })
  
  return (
    <Box
      ref={meshRef}
      position={position}
      args={[size, size, size]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshBasicMaterial 
        color={hovered ? '#ffffff' : color} 
        wireframe 
        transparent 
        opacity={hovered ? 1 : 0.7}
      />
    </Box>
  )
}

// Connection line between nodes
function NodeConnection({ 
  start, 
  end, 
  mouse,
  pulseSpeed = 1
}: { 
  start: [number, number, number]
  end: [number, number, number]
  mouse: { x: number; y: number }
  pulseSpeed?: number
}) {
  const [points, setPoints] = useState([new THREE.Vector3(...start), new THREE.Vector3(...end)])
  
  useFrame(({ clock }) => {
    // Subtle wave effect along the line
    const wave = Math.sin(clock.getElapsedTime() * pulseSpeed) * 0.1
    
    const midPoint = new THREE.Vector3(
      (start[0] + end[0]) / 2 + mouse.x * 0.2,
      (start[1] + end[1]) / 2 + mouse.y * 0.2 + wave,
      (start[2] + end[2]) / 2
    )
    
    setPoints([
      new THREE.Vector3(start[0] + mouse.x * 0.1, start[1] + mouse.y * 0.1, start[2]),
      midPoint,
      new THREE.Vector3(end[0] + mouse.x * 0.1, end[1] + mouse.y * 0.1, end[2])
    ])
  })
  
  return (
    <Line
      points={points}
      color="#00F0FF"
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  )
}

// Central rotating core
function CentralCore({ mouse }: { mouse: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Rotate based on mouse position
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2 + mouse.x * 0.3
      groupRef.current.rotation.x = mouse.y * 0.2
    }
    
    if (coreRef.current) {
      // Pulsing effect
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.05
      coreRef.current.scale.setScalar(pulse)
    }
    
    if (glowRef.current) {
      // Glow pulse
      const glowPulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.1
      glowRef.current.scale.setScalar(glowPulse)
    }
  })
  
  return (
    <group ref={groupRef}>
      {/* Main icosahedron */}
      <Icosahedron
        ref={coreRef}
        args={[1.2, 1]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={0.8}
        />
      </Icosahedron>
      
      {/* Inner glow sphere */}
      <Sphere
        ref={glowRef}
        args={[0.8, 32, 32]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.15}
        />
      </Sphere>
      
      {/* Core center point */}
      <Sphere args={[0.15, 16, 16]} position={[0, 0, 0]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
    </group>
  )
}

// Orbiting ring of nodes
function OrbitRing({ 
  radius, 
  nodeCount, 
  speed, 
  tilt = 0,
  mouse,
  yOffset = 0
}: { 
  radius: number
  nodeCount: number
  speed: number
  tilt?: number
  mouse: { x: number; y: number }
  yOffset?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  
  const nodes = useMemo(() => {
    return Array.from({ length: nodeCount }, (_, i) => {
      const angle = (i / nodeCount) * Math.PI * 2
      return {
        id: i,
        angle,
        basePos: [
          Math.cos(angle) * radius,
          yOffset + Math.sin(angle * 2) * 0.3,
          Math.sin(angle) * radius
        ] as [number, number, number]
      }
    })
  }, [radius, nodeCount, yOffset])
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * speed
      groupRef.current.rotation.z = tilt
    }
  })
  
  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <InteractiveNode
          key={node.id}
          position={node.basePos}
          size={0.1 + (i % 3) * 0.02}
          mouse={mouse}
        />
      ))}
      
      {/* Connections between adjacent nodes */}
      {nodes.map((node, i) => {
        const nextNode = nodes[(i + 1) % nodes.length]
        return (
          <NodeConnection
            key={`conn-${i}`}
            start={node.basePos}
            end={nextNode.basePos}
            mouse={mouse}
            pulseSpeed={1 + i * 0.2}
          />
        )
      })}
    </group>
  )
}

// Floating data particles
function DataParticles({ count = 30 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities: Array<{ x: number; y: number; z: number }> = []
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      })
    }
    
    return { positions, velocities }
  }, [count])
  
  useFrame(() => {
    if (!pointsRef.current) return
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.velocities[i].x
      positions[i * 3 + 1] += particles.velocities[i].y
      positions[i * 3 + 2] += particles.velocities[i].z
      
      // Wrap around
      if (Math.abs(positions[i * 3]) > 7.5) positions[i * 3] *= -0.9
      if (Math.abs(positions[i * 3 + 1]) > 7.5) positions[i * 3 + 1] *= -0.9
      if (Math.abs(positions[i * 3 + 2]) > 5) positions[i * 3 + 2] *= -0.9
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.rotation.y += 0.001
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00F0FF"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Hexagonal grid floor
function HexGrid() {
  const gridRef = useRef<THREE.Group>(null)
  
  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Subtle wave motion
      gridRef.current.position.y = -4 + Math.sin(clock.getElapsedTime() * 0.5) * 0.2
    }
  })
  
  const hexagons = useMemo(() => {
    const hexes: Array<{ position: [number, number, number]; scale: number }> = []
    const radius = 0.5
    const rings = 5
    
    for (let ring = 0; ring < rings; ring++) {
      const count = ring === 0 ? 1 : ring * 6
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (ring * Math.PI / 6)
        const dist = ring * radius * 1.8
        hexes.push({
          position: [
            Math.cos(angle) * dist,
            0,
            Math.sin(angle) * dist
          ],
          scale: 1 - ring * 0.1
        })
      }
    }
    return hexes
  }, [])
  
  return (
    <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]}>
      {hexagons.map((hex, i) => (
        <mesh key={i} position={hex.position} scale={hex.scale}>
          <ringGeometry args={[0.3, 0.35, 6]} />
          <meshBasicMaterial 
            color="#00F0FF" 
            transparent 
            opacity={0.1 + (5 - Math.floor(i / 6)) * 0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

// Main scene component
function Scene() {
  const mouse = useMousePosition()
  const { camera } = useThree()
  
  useFrame(() => {
    // Subtle camera movement based on mouse
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)
  })
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00F0FF" />
      
      {/* Central core */}
      <CentralCore mouse={mouse} />
      
      {/* Orbit rings */}
      <OrbitRing 
        radius={2.5} 
        nodeCount={8} 
        speed={0.3} 
        tilt={0.2}
        mouse={mouse}
        yOffset={0.5}
      />
      <OrbitRing 
        radius={3.5} 
        nodeCount={12} 
        speed={-0.2} 
        tilt={-0.3}
        mouse={mouse}
        yOffset={-0.3}
      />
      <OrbitRing 
        radius={4.5} 
        nodeCount={16} 
        speed={0.15} 
        tilt={0.4}
        mouse={mouse}
        yOffset={0.2}
      />
      
      {/* Data particles */}
      <DataParticles count={50} />
      
      {/* Hex grid floor */}
      <HexGrid />
      
      {/* Connection lines from center to orbits */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2
        return (
          <NodeConnection
            key={i}
            start={[0, 0, 0]}
            end={[
              Math.cos(angle) * 2.5,
              Math.sin(angle * 2) * 0.3,
              Math.sin(angle) * 2.5
            ]}
            mouse={mouse}
            pulseSpeed={2}
          />
        )
      })}
    </>
  )
}

// Main component
export default function InteractiveBlockchain() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      }}
    >
      <Scene />
    </Canvas>
  )
}
