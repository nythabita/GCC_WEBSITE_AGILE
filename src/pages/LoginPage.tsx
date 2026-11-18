import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { logoGccColor } from "../assets/brand";
import LoadingScreen, { AuthBackdrop } from "../components/UI/loading";
import { buttonStyles } from "../components/UI/button-styles";
import { useAuth } from "../auth/AuthContext";
import { safeReturnTo } from "../../shared/auth";

// Sign-in is Google-only and runs on Supabase Auth (PKCE). The Google account is created on first sign-in by a database trigger.
// Set VITE_GOOGLE_AUTH_ENABLED=true only after the Google provider and the /login redirect URL are configured in Supabase.
const RETURN_KEY = "gcc.auth.returnTo";
const googleEnabled = import.meta.env.VITE_GOOGLE_AUTH_ENABLED === "true";

const primary = buttonStyles({ variant: "berry", size: "md", fullWidth: true, className: "text-sm" });
const google = buttonStyles({ variant: "white", size: "md", fullWidth: true, className: "!border-[#dadce0] text-sm" });

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-[18px] shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

function readStoredReturn(): string | null {
  try { return sessionStorage.getItem(RETURN_KEY); } catch { return null; }
}
function storeReturn(path: string) {
  try { sessionStorage.setItem(RETURN_KEY, path); } catch { /* Falls back to the homepage after OAuth. */ }
}
function clearReturn() {
  try { sessionStorage.removeItem(RETURN_KEY); } catch { /* Nothing stored. */ }
}

export default function LoginPage() {
  const { session, loading, error: sessionError, services } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);

  useEffect(() => {
    const previous = document.title;
    document.title = "Masuk — Growth Consulting";
    return () => { document.title = previous; };
  }, []);

  // Coming back from Google with the Back button can restore this page from the browser cache with the busy state still set.
  useEffect(() => {
    const reset = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      pending.current = false;
      setBusy(false);
    };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const query = new URLSearchParams(location.search);
  const next = safeReturnTo(query.get("next") ?? readStoredReturn());
  // Supabase redirects back with ?error=… / #error=… on a denied or failed consent, or leaves a ?code= that never becomes a session.
  const callbackFailed =
    query.has("error") ||
    new URLSearchParams(location.hash.slice(1)).has("error") ||
    (query.has("code") && !loading && !session);

  const signIn = async () => {
    if (pending.current || !services || !googleEnabled) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      storeReturn(next);
      const { error: failure } = await services.client.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/login` },
      });
      if (failure) throw failure;
    } catch {
      setError("Login Google belum berhasil. Periksa koneksi Anda lalu coba lagi.");
      pending.current = false;
      setBusy(false);
    }
    // On success the browser leaves for Google, so the busy state is kept until the page unloads.
  };

  const signOut = async () => {
    if (pending.current || !services) return;
    pending.current = true;
    setBusy(true);
    setError("");
    try {
      const { error: failure } = await services.client.auth.signOut({ scope: "local" });
      if (failure) throw failure;
    } catch {
      setError("Keluar belum berhasil. Silakan coba lagi.");
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  const proceed = () => {
    clearReturn();
    navigate(next, { replace: true });
  };

  const message = error || sessionError || (callbackFailed ? "Login Google belum berhasil diselesaikan. Silakan coba lagi." : "");

  return (
    <>
      <AuthBackdrop className="min-h-dvh pb-24">
        <div className="px-4 pt-4">
          <Link to="/" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-forest">Kembali ke beranda</Link>
        </div>
        <img src={logoGccColor} alt="Growth Consulting Club" className="mx-auto mt-[58px] w-[268px] max-w-[calc(100%-48px)]" />

        <main className="px-5">
          <div className="mx-auto mt-[43px] w-full max-w-[350px] rounded-3xl bg-white p-6 text-forest shadow-sm md:max-w-md">
            <h1 className="font-display text-[28px] font-bold italic leading-[1.15] tracking-normal">
              {session ? "Anda sudah masuk" : "Masuk ke GCC"}
            </h1>

            {message && <p role="alert" className="mt-5 text-sm font-medium leading-6 text-berry">{message}</p>}

            {loading ? (
              <p role="status" className="mt-6 text-sm font-medium">Memeriksa sesi login…</p>
            ) : session ? (
              <>
                <p className="mt-6 text-sm font-medium leading-6">Masuk sebagai</p>
                <p className="mt-1 break-words text-sm font-semibold text-teal-deep">{session.user.email}</p>
                <button type="button" className={`${primary} mt-8`} onClick={proceed}>Lanjutkan</button>
                <button type="button" disabled={busy} className="mt-3 min-h-11 w-full text-sm font-semibold text-teal-deep disabled:opacity-60" onClick={() => void signOut()}>
                  Keluar
                </button>
              </>
            ) : (
              <>
                <p className="mt-5 text-sm font-medium leading-6">
                  Masuk dengan akun Google untuk mengirim pengajuan program GCC. Akun GCC Anda dibuat otomatis saat pertama kali masuk.
                </p>
                <button type="button" className={`${google} mt-8`} disabled={busy || !services || !googleEnabled} onClick={() => void signIn()}>
                  <GoogleMark />
                  Lanjutkan dengan Google
                </button>
                {googleEnabled ? (
                  <p className="mt-5 text-xs font-medium leading-5 text-forest/80">
                    GCC hanya menerima nama dan alamat email dari akun Google Anda. Kata sandi Anda tidak dibagikan kepada GCC.
                  </p>
                ) : (
                  <p role="status" className="mt-5 text-sm font-medium leading-6">Login belum tersedia saat ini. Silakan hubungi pengelola GCC.</p>
                )}
              </>
            )}
          </div>
        </main>
      </AuthBackdrop>
      {busy && <LoadingScreen />}
    </>
  );
}
