import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { logoGccColor } from '../assets/brand';
import LoadingScreen, { AuthBackdrop } from '../components/UI/loading';
import { buttonStyles } from '../components/UI/button-styles';
import { useAuth } from '../auth/AuthContext';
import { safeReturnTo } from '../../shared/auth';

const input = 'block h-[50px] w-full rounded-lg border border-line bg-white px-3.5 text-sm font-medium text-forest placeholder:text-forest/80 focus:border-brand-blue';
const primary = buttonStyles({ variant: 'berry', size: 'md', fullWidth: true, className: 'text-sm disabled:opacity-60' });
const secondary = buttonStyles({ variant: 'white', size: 'md', fullWidth: true, className: '!border-[#e2e8e4] text-sm disabled:opacity-60' });
function Card({children}:{children:ReactNode}) { return <div className="mx-auto mt-[43px] min-h-[480px] w-full max-w-[350px] rounded-3xl bg-white p-6 text-forest shadow-sm md:max-w-md">{children}</div>; }

export default function LoginPage() {
  const {session, loading, error: configError, services} = useAuth();
  const location = useLocation(); const navigate = useNavigate();
  let storedNext: string | null = null;
  try { storedNext = sessionStorage.getItem('gcc.auth.returnTo'); } catch { /* Storage can be disabled; use the explicit route or home. */ }
  const next = safeReturnTo(new URLSearchParams(location.search).get('next') ?? storedNext);
  const [step,setStep] = useState<'signin'|'signup'|'verify'>('signin');
  const [email,setEmail] = useState(''); const [name,setName] = useState('');
  const [code,setCode] = useState(''); const [error,setError] = useState('');
  const [busy,setBusy] = useState(false); const pending = useRef(false);
  const [cooldown,setCooldown] = useState(0); const [creating,setCreating] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(()=>{heading.current?.focus();},[step,session]);
  useEffect(()=>{if(cooldown<=0)return; const timer=window.setTimeout(()=>setCooldown(x=>x-1),1000); return ()=>window.clearTimeout(timer);},[cooldown]);
  const callbackError = new URLSearchParams(location.search).has('error') || new URLSearchParams(location.hash.slice(1)).has('error');
  const run = async(action:()=>Promise<void>)=> {
    if(pending.current)return; pending.current=true; setBusy(true);setError('');
    try {await action();} catch(e) {setError(e instanceof Error?e.message:'Permintaan belum berhasil. Coba lagi.');}
    finally {pending.current=false;setBusy(false);}
  };
  const sendCode = (signup:boolean)=>run(async()=> {
    if(!services)throw new Error('Layanan login belum tersedia. Hubungi pengelola.');
    if(!/^\S+@\S+\.\S+$/u.test(email.trim()))throw new Error('Tulis alamat email yang valid.');
    if(signup && (!name.trim()||name.trim().length>160))throw new Error('Isi nama lengkap, maksimal 160 karakter.');
    const {error:failure}=await services.client.auth.signInWithOtp({email:email.trim(), options:{shouldCreateUser:signup,...(signup?{data:{full_name:name.trim()}}:{})}});
    if(failure)throw new Error(failure.status===429?'Terlalu banyak permintaan. Tunggu sebentar sebelum mencoba lagi.':'Kode belum dapat dikirim. Periksa email atau hubungi pengelola bila berulang.');
    setCreating(signup);setCode('');setCooldown(60);setStep('verify');
  });
  const verify = ()=>run(async()=> {
    if(!services)throw new Error('Layanan login belum tersedia.');
    if(!/^\d{6}$/u.test(code))throw new Error('Masukkan kode 6 digit dari email.');
    const {data,error:failure}=await services.client.auth.verifyOtp({email:email.trim(),token:code,type:'email'});
    if(failure||!data.session)throw new Error('Kode tidak valid atau sudah kedaluwarsa. Periksa kode atau minta kode baru.');
  });
  const google = ()=>run(async()=> {
    if(!services)throw new Error('Layanan login belum tersedia.');
    try { sessionStorage.setItem('gcc.auth.returnTo',next); } catch { /* Return to home if session storage is unavailable. */ }
    const {error:failure}=await services.client.auth.signInWithOAuth({provider:'google',options:{redirectTo:`${window.location.origin}/login`}});
    if(failure)throw new Error('Login Google belum berhasil. Coba kembali atau gunakan email.');
  });
  const showError = error || configError || (callbackError ? 'Login belum berhasil diselesaikan. Silakan coba lagi.' : '');
  const title = session ? 'You’re signed in' : step==='verify' ? 'Check your email' : step==='signup' ? 'Create Your GCC Account' : 'Sign in to GCC';
  return <>
    <AuthBackdrop className="min-h-dvh pb-24">
      <div className="px-4 pt-4"><Link to="/" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-forest">Back to home page</Link></div>
      <img src={logoGccColor} alt="Growth Consulting Club" className="mx-auto mt-[58px] w-[268px] max-w-[calc(100%-48px)]" />
      <div className="px-5"><Card>
        <h1 ref={heading} tabIndex={-1} className="font-display text-[28px] font-bold italic leading-[1.15] tracking-normal text-forest focus:outline-none">{title}</h1>
        {showError && <p role="alert" className="mt-5 text-sm text-berry">{showError}</p>}
        {loading ? <p role="status" className="mt-6">Memeriksa sesi login…</p> : session ? <>
          <p className="mt-8 text-sm">Anda sudah masuk ke GCC.</p><p className="mt-4 break-words text-sm font-semibold">{session.user.email}</p>
          <button type="button" className={`${primary} mt-9`} onClick={()=>{try {sessionStorage.removeItem('gcc.auth.returnTo');} catch { /* No stored redirect. */ } navigate(next,{replace:true});}}>Continue</button>
          <button type="button" disabled={busy} className={`${secondary} mt-4`} onClick={()=>void run(async()=>{const {error:failure}=await services!.client.auth.signOut({scope:'local'});if(failure)throw new Error('Logout belum berhasil. Coba lagi.');setStep('signin');setCode('');})}>Sign out</button>
        </> : step==='verify' ? <>
          <p className="mt-6 text-sm leading-6">Masukkan kode 6 digit yang dikirim ke <span className="break-words font-semibold">{email.trim()}</span>.</p>
          <form noValidate onSubmit={e=>{e.preventDefault();void verify();}}>
            <label htmlFor="login-code" className="mt-8 block text-sm font-semibold">Verification code</label>
            <input id="login-code" className={`${input} mt-3 text-center tracking-[0.4em]`} inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e=>{setCode(e.target.value.replace(/\D/gu,'').slice(0,6));setError('');}} disabled={busy}/>
            <button type="submit" disabled={busy||!services} className={`${primary} mt-6`}>Verify and continue</button>
          </form>
          <button type="button" disabled={busy||cooldown>0||!services} className={`${secondary} mt-4`} onClick={()=>void sendCode(creating)}>{cooldown>0?`Resend code (${cooldown}s)`:'Resend code'}</button>
          <button type="button" disabled={busy} onClick={()=>{setStep(creating?'signup':'signin');setCode('');setError('');}} className="mt-6 min-h-11 text-sm font-semibold text-teal-deep">Use a different email</button>
        </> : <>
          <p className="mt-5 text-sm leading-6">{step==='signup'?'Buat akun GCC dan verifikasi alamat email Anda.':'Masuk dengan kode verifikasi dari email Anda.'}</p>
          <form noValidate onSubmit={e=>{e.preventDefault();void sendCode(step==='signup');}}>
            {step==='signup'&&<><label htmlFor="signup-name" className="mt-6 block text-sm font-semibold">Full name</label><input id="signup-name" className={`${input} mt-2`} autoComplete="name" maxLength={160} value={name} onChange={e=>setName(e.target.value)} disabled={busy}/></>}
            <label htmlFor="login-email" className="mt-6 block text-sm font-semibold">Email address</label>
            <input id="login-email" className={`${input} mt-2`} type="email" autoComplete="email" value={email} onChange={e=>{setEmail(e.target.value);setError('');}} disabled={busy} />
            <button type="submit" disabled={busy||!services} className={`${primary} mt-5`}>{step==='signup'?'Create Account':'Continue'}</button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs" aria-hidden="true"><span className="h-px flex-1 bg-line"/>or<span className="h-px flex-1 bg-line"/></div>
          <button type="button" className={secondary} disabled={busy||!services||import.meta.env.VITE_GOOGLE_AUTH_ENABLED!=='true'} onClick={()=>void google()}>Continue with Google</button>
          {import.meta.env.VITE_GOOGLE_AUTH_ENABLED!=='true'&&<p className="mt-3 text-xs leading-5">Login Google belum tersedia. Gunakan email.</p>}
          <button type="button" disabled={busy} className="mt-6 min-h-11 text-sm font-semibold text-teal-deep" onClick={()=>{setStep(step==='signup'?'signin':'signup');setError('');}}>{step==='signup'?'Already have an account? Sign in':'Don’t have an account? Sign up'}</button>
        </>}
      </Card></div>
    </AuthBackdrop>
    {busy && <LoadingScreen />}
  </>;
}
