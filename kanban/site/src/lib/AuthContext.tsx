import React, { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { AuthContext } from './auth-context'
import { supabase } from './supabase'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      return
    }

    let isMounted = true

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted) {
          return
        }

        if (error) {
          setUser(null)
        } else {
          setUser(data.session?.user ?? null)
        }

        setLoading(false)
      })
      .catch(() => {
        if (!isMounted) {
          return
        }

        setUser(null)
        setLoading(false)
      })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{!loading && children}</AuthContext.Provider>
}
