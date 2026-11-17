import { useEffect, useState, type ReactNode } from 'react';
import { getServices } from '../lib/supabase';
import { AuthContext, type AuthState } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initial] = useState<AuthState>(() => {
    try { return {session:null,loading:true,error:'',services:getServices()}; }
    catch (error) { return {session:null,loading:false,error:error instanceof Error?error.message:'Layanan belum dikonfigurasi.',services:null}; }
  });
  const [state, setState] = useState<AuthState>(initial);
  useEffect(() => {
    let alive = true; let unsubscribe: (() => void) | undefined;
      const services = initial.services;
      if (!services) return;
      // Subscribe first so token refresh/sign-out cannot be overwritten by an older bootstrap result.
      let changed = false;
      const { data } = services.client.auth.onAuthStateChange((_event, session) => {
        changed = true;
        if (alive) setState({ session, services, loading: false, error: '' });
      });
      unsubscribe = () => data.subscription.unsubscribe();
      void services.client.auth.getSession().then(({ data, error }) => {
        if (alive && !changed) setState({ services, session: data.session, loading: false, error: error ? 'Sesi belum dapat diperiksa. Coba muat ulang halaman.' : '' });
      }).catch(() => { if (alive) setState({ services, session: null, loading: false, error: 'Sesi belum dapat diperiksa. Coba muat ulang halaman.' }); });
    return () => { alive = false; unsubscribe?.(); };
  }, [initial.services]);
  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}
