"use client"

import type React from "react"
import AOSInit from "@/lib/aos"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AOSInit />
      {children}
    </>
  )
}
