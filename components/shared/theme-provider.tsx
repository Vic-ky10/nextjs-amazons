"use client"

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = "theme"
const THEME_VALUES: Theme[] = ["light", "dark", "system"]
const ThemeContext = createContext<ThemeContextValue | null>(null)

function isTheme(value: string | null): value is Theme {
  return THEME_VALUES.includes(value as Theme)
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"

  try {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    if (isTheme(storedTheme)) return storedTheme
  } catch {
    // Fall through to the cookie value.
  }

  const cookieTheme = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${STORAGE_KEY}=`))
    ?.split("=")[1] ?? null

  return isTheme(cookieTheme) ? cookieTheme : "system"
}

function resolveTheme(theme: Theme): ResolvedTheme {
  if (typeof window === "undefined") return "light"
  return theme === "system" ? getSystemTheme() : theme
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolvedTheme = resolveTheme(theme)
  const root = document.documentElement

  root.classList.remove("light", "dark")
  root.classList.add(resolvedTheme)
  root.style.colorScheme = resolvedTheme

  return resolvedTheme
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme)
  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>(() => resolveTheme(getStoredTheme()))

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)

    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme)
      document.cookie = `${STORAGE_KEY}=${nextTheme}; path=/; max-age=31536000; samesite=lax`
    } catch {
      // Ignore storage failures in private browsing or locked-down contexts.
    }

    setResolvedTheme(applyTheme(nextTheme))
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemThemeChange = () => {
      if (theme === "system") {
        setResolvedTheme(applyTheme("system"))
      }
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
  }, [theme])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return

      const nextTheme = isTheme(event.newValue) ? event.newValue : "system"
      setThemeState(nextTheme)
      setResolvedTheme(applyTheme(nextTheme))
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
