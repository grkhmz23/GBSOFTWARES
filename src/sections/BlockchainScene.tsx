import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Icosahedron, Box, Line } from '@react-three/drei'
import * as THREE from 'three'

// Orbiting block component
function OrbitingBlock({ 
  radius, 
  speed, 
  offset,
  size = 0.15 
}: { 
  radius: number
  speed: number
  offset: number
  size?: number 
}) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      const time = clock.getElapsedTime() * speed + offset
      ref.current.position.x = Math.cos(time) * radius
      ref.current.position.y = Math.sin(time * 0.7) * (radius * 0.3)
      ref.current.position.z = Math.sin(time) * radius
      ref.current.rotation.x = time
      ref.current.rotation.y = time * 0.5
    }
  })

  const linePoints = useMemo(() => {
    return [new THREE.Vector3(0, 0, 0), new THREE.Vector3(radius, 0, 0)]
  }, [radius])

  return (
    <group>
      <Box
        ref={ref}
        args={[size, size, size]}
        position={[radius, 0, 0]}
      >
        <meshBasicMaterial color="#00F0FF" wireframe transparent opacity={0.6} />
      </Box>
      <Line
        points={linePoints}
        color="#00F0FF"
        lineWidth={0.5}
        transparent
        opacity={0.15}
      />
    </group>
  )
}

// Particle field
function ParticleField({ count = 50 }: { count?: number }) {
  const points = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    return positions
  }, [count])

  const ref = useRef<THREE.Points>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.02
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00F0FF"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  )
}

// Grid floor
function GridFloor() {
  const gridRef = useRef<THREE.GridHelper>(null)

  useFrame(({ clock }) => {
    if (gridRef.current) {
      // Subtle movement
      gridRef.current.position.z = (clock.getElapsedTime() * 0.2) % 2
    }
  })

  return (
    <gridHelper
      ref={gridRef}
      args={[20, 40, '#1F2937', '#1F2937']}
      position={[0, -3, 0]}
      rotation={[0, 0, 0]}
    />
  )
}

// Main blockchain core
function BlockchainCore() {
  const groupRef = useRef<THREE.Group>(null)
  const coreRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15
    }
    if (coreRef.current) {
      // Pulsing effect
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.02
      coreRef.current.scale.setScalar(scale)
    }
  })

  // Generate orbiting blocks
  const blocks = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      radius: 2 + (i % 3) * 0.8,
      speed: 0.3 + (i % 2) * 0.2,
      offset: (i / 8) * Math.PI * 2,
      size: 0.12 + (i % 2) * 0.05,
    }))
  }, [])

  return (
    <group ref={groupRef}>
      {/* Central Icosahedron */}
      <Icosahedron
        ref={coreRef}
        args={[1, 1]}
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
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial
          color="#00F0FF"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Orbiting blocks */}
      {blocks.map((block, index) => (
        <OrbitingBlock
          key={index}
          radius={block.radius}
          speed={block.speed}
          offset={block.offset}
          size={block.size}
        />
      ))}

      {/* Connection lines between blocks */}
      {blocks.map((_, i) => 
        blocks.slice(i + 1).map((_, j) => {
          const idx1 = i
          const idx2 = i + j + 1
          if (idx2 < blocks.length) {
            return (
              <Line
                key={`${idx1}-${idx2}`}
                points={[
                  new THREE.Vector3(
                    Math.cos(blocks[idx1].offset) * blocks[idx1].radius,
                    0,
                    Math.sin(blocks[idx1].offset) * blocks[idx1].radius
                  ),
                  new THREE.Vector3(
                    Math.cos(blocks[idx2].offset) * blocks[idx2].radius,
                    0,
                    Math.sin(blocks[idx2].offset) * blocks[idx2].radius
                  ),
                ]}
                color="#00F0FF"
                lineWidth={0.3}
                transparent
                opacity={0.08}
              />
            )
          }
          return null
        })
      )}
    </group>
  )
}

// Main scene
export default function BlockchainScene() {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Point light for glow effect */}
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00F0FF" />
      
      {/* Main blockchain core */}
      <BlockchainCore />
      
      {/* Particle field */}
      <ParticleField count={60} />
      
      {/* Grid floor */}
      <GridFloor />
      
      {/* Camera positioning */}
      <group position={[2, 0, 0]} />
    </>
  )
}
