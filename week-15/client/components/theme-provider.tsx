"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { useMounted } from "@/hooks/use-mounted"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    const mounted = useMounted()
    if(!mounted) return null
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}