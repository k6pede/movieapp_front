import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export default function Character(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF('/assets/3d/apple.glb') as any

  console.log(nodes, materials['Apple_Body'])

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      <mesh
        geometry={nodes.Apple.geometry}
        material={materials['Apple_Body']}
        position={[0, 0.5, 0]}
        scale={[5, 5, 5]}
      >
        <meshStandardMaterial color="#FFD700" />
      </mesh>
    </group>
  )
}
