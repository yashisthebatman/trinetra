import React, { createContext, useContext, useMemo, useState } from 'react'

type User = {
  uid: string
  username: string
  email: string
  organization: string
  displayName: string
  avatarUrl: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const defaultUser: User = {
  uid: 'Trinetra-UID-007',
  username: 's.analyst',
  email: 'analyst@kmrl.co.in',
  organization: 'Kochi Metro Rail Ltd.',
  displayName: 'S. Analyst',
  avatarUrl: 'https://i.pravatar.cc/150?u=analyst',
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(defaultUser)

  const value = useMemo<AuthContextType>(() => ({
    user,
    login: async (email: string, _password: string) => {
      setUser({ ...defaultUser, email: email || defaultUser.email })
    },
    logout: () => setUser(null),
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // Soft fallback for mock/demo so the app never crashes if provider is missing.
    return {
      user: defaultUser,
      login: async () => {},
      logout: () => {},
    } as AuthContextType
  }
  return ctx
}