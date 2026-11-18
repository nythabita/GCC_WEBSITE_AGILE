import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Services } from '../lib/supabase';
export type AuthState = { session: Session | null; loading: boolean; error: string; services: Services | null };
export const AuthContext = createContext<AuthState>({ session: null, loading: true, error: '', services: null });
export function useAuth() { return useContext(AuthContext); }
