import { useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { logoGccColor } from '../assets/brand';
import LoadingScreen, { AuthBackdrop } from '../components/UI/loading';
import { buttonStyles } from '../components/UI/button-styles';
import { useAuth } from '../auth/AuthContext';
import { safeReturnTo } from '../../shared/auth';

const primary = buttonStyles({ variant: 'berry', size: 'md', fullWidth: true, className: 'text-sm disabled:opacity-60' });

export default function LoginPage() {
  const {session, loading, error: configError, services} = useAuth();
  const location = useLocation(); const navigate = useNavigate();
  let storedNext: string | null = null;
  try { storedNext = sessionStorage.getItem('gcc.auth.returnTo'); } catch { /* Default to home when storage is unavailable. */ }
  const next = safeReturnTo(new URLSearchParams(location.search).get('next') ?? storedNext);
  const [error,setError] = useState(''); const [busy,setBusy] = useState(false); const pending = useRef(false);
  const query = new URLSearchParams(location.search);
  const callbackError = query.has('error') ||
    new URLSearchParams(location.hash.slice(1)).has('error') ||
    (query.has('code') && !loading && !session);
  const enabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === 'true';
  const login = async()=> {
    if(pending.current || !services || !enabled) return;
    pending.current = true; setBusy(true); setError('');
    try {
      try {sessionStorage.setItem('gcc.auth.returnTo', next);} catch { /* Default to home after OAuth. */ }
      const {error:failure} = await services.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${window.location.origin}/login`}});
      if(failure)throw new Error('Login Google belum berhasil. Silakan coba kembali.');
    } catch {setError('Login Google belum berhasil. Periksa koneksi atau hubungi pengelola.');}
    finally {pending.current=false;setBusy(false);}
  };
  const logout = async()=> {
    if(!services || pending.current)return;
    pending.current=true;setBusy(true);setError('');
    try {const {error:failure}=await services.client.auth.signOut({scope:'local'});if(failure)throw failure;}
    catch {setError('Logout belum berhasil. Silakan coba kembali.');}
    finally {pending.current=false;setBusy(false);}
  };
  const showError = error || configError || (callbackError ? 'Login Google belum berhasil diselesaikan. Silakan coba lagi.' : '');
  return <>
    <AuthBackdrop className="min-h-dvh pb-24">
      <div className="px-4 pt-4"><Link to="/" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-forest">Back to home page</Link></div>
      <img src={logoGccColor} alt="Growth Consulting Club" className="mx-auto mt-[58px] w-[268px] max-w-[calc(100%-48px)]" />
      <div className="px-5"><div className="mx-auto mt-[43px] min-h-[360px] w-full max-w-[350px] rounded-3xl bg-white p-6 text-forest shadow-sm md:max-w-md">
        <h1 className="font-display text-[28px] font-bold italic leading-[1.15] tracking-normal">{session?'You’re signed in':'Sign in to GCC'}</h1>
        {showError && <p role="alert" className="mt-5 text-sm text-berry">{showError}</p>}
        {loading ? <p role="status" className="mt-6">Memeriksa sesi login…</p> : session ? <>
          <p className="mt-8 text-sm">Anda sudah masuk ke GCC.</p><p className="mt-4 break-words text-sm font-semibold">{session.user.email}</p>
          <button type="button" className={`${primary} mt-9`} onClick={()=>{try {sessionStorage.removeItem('gcc.auth.returnTo');} catch { /* No stored redirect. */ }navigate(next,{replace:true});}}>Continue</button>
          <button type="button" disabled={busy} className="mt-4 min-h-11 w-full text-sm font-semibold text-teal-deep" onClick={()=>void logout()}>Sign out</button>
        </> : <>
          <p className="mt-6 text-sm leading-6">Masuk dengan akun Google untuk mengirim pengajuan program GCC. Akun GCC dibuat saat pertama kali Anda masuk.</p>
          <button type="button" className={`${primary} mt-8`} disabled={busy||!services||!enabled} onClick={()=>void login()}>Continue with Google</button>
          {!enabled && <p role="status" className="mt-4 text-sm leading-6">Login belum tersedia. Silakan hubungi pengelola GCC.</p>}
        </>}
      </div></div>
    </AuthBackdrop>
    {busy && <LoadingScreen />}
  </>;
}
