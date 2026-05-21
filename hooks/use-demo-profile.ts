'use client'

import { useEffect, useState } from 'react'

export const demoProfileStorageKey = 'demo-profile'
export const demoProfileUpdatedEvent = 'demo-profile-updated'

export type DemoProfile = {
  name: string
  email: string
  phone: string
  address: string
}

export const defaultDemoProfile: DemoProfile = {
  name: 'Guest shopper',
  email: 'guest@example.com',
  phone: '+91 ',
  address: '',
}

function readDemoProfile() {
  if (typeof window === 'undefined') return defaultDemoProfile

  const savedProfile = window.localStorage.getItem(demoProfileStorageKey)

  if (!savedProfile) return defaultDemoProfile

  try {
    return {
      ...defaultDemoProfile,
      ...(JSON.parse(savedProfile) as Partial<DemoProfile>),
    }
  } catch {
    return defaultDemoProfile
  }
}

export function saveDemoProfile(profile: DemoProfile) {
  window.localStorage.setItem(demoProfileStorageKey, JSON.stringify(profile))
  window.dispatchEvent(new Event(demoProfileUpdatedEvent))
}

export function useDemoProfile() {
  const [profile, setProfile] = useState(defaultDemoProfile)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const syncProfile = () => {
      setProfile(readDemoProfile())
      setIsConnected(Boolean(window.localStorage.getItem(demoProfileStorageKey)))
    }

    syncProfile()
    window.addEventListener('storage', syncProfile)
    window.addEventListener(demoProfileUpdatedEvent, syncProfile)

    return () => {
      window.removeEventListener('storage', syncProfile)
      window.removeEventListener(demoProfileUpdatedEvent, syncProfile)
    }
  }, [])

  return { profile, setProfile, isConnected }
}
