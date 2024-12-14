'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Character from '@/app/components/characterChat/Character'
import ChatInterface from '@/app/components/characterChat/CharacterInterface'

export default function CharacterChatPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-grow relative">
        <Canvas
          camera={{ position: [0, 2, 5], fov: 50 }}
          style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)' }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Character position={[0, -1, 0]} />
          </Suspense>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            // minDistance={3}
            // maxDistance={6}
          />
        </Canvas>
      </div>
      <ChatInterface />
    </div>
  )
}
