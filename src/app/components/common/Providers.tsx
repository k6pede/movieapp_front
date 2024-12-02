'use client'

import { AuthProvider } from '@/context/auth'
import { NextUIProvider } from '@nextui-org/react'
import { useRouter } from 'next/navigation'

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()

  return (
    <AuthProvider>
      <NextUIProvider navigate={router.push}>{children}</NextUIProvider>
    </AuthProvider>
  )
}
