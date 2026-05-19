import { createContext } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export interface AuthContextType {
  user: User | null
  loading: boolean
}

const initialLoadingState = supabase !== null

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: initialLoadingState,
})
