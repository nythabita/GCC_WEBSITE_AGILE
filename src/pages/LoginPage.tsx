import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { logoGccColor } from "../assets/brand";
import LoadingScreen, { AuthBackdrop } from "../components/UI/loading";
import { buttonStyles } from "../components/UI/button-styles";

// "0. LOGIN TO HOMEPAGE" Figma export: demo sign-in flow (no real accounts, no email, no Google). Copy follows the design (English).
// Steps: signin -> verify (6-digit code) -> done; Google and sign-up detours; "resend" confirmation screen.
type Step = "signin" | "verify" | "google" | "signup" | "done" | "resend";

const DEMO_EMAIL = "student@example.com";
const DEMO_NAME = "GCC Demo Student";
const DEMO_CODE = "123456";
const LOADING_MS = 900;

const input = "block h-[50px] w-full rounded-lg border bg-white px-3.5 text-sm font-medium text-forest placeholder:text-forest/80 focus:border-brand-blue";
const primary = buttonStyles({ variant: "berry", size: "md", fullWidth: true, className: "text-sm" });
const secondary = buttonStyles({ variant: "white", size: "md", fullWidth: true, className: "!border-[#e2e8e4] text-sm" });
const note = "text-[11px] font-medium leading-4 text-forest";

function Card({ children }: { children: ReactNode }) {
  return <div className="mx-auto mt-[43px] min-h-[480px] w-full max-w-[350px] rounded-3xl bg-white p-6 text-forest shadow-sm md:max-w-md">{children}</div>;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const timer = useRef<number | undefined>(undefined);
  const first = useRef(true);

  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    heading.current?.focus();
  }, [step]);

  // Every forward move shows the splash briefly, like the loading frames in the design.
  const go = (next: Step | "home") => {
    setError("");
    setLoading(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      if (next === "home") navigate("/");
      else setStep(next);
    }, LOADING_MS);
  };
  const jump = (next: Step) => { setError(""); setStep(next); };

  const submitEmail = () => {
    const value = email.trim();
    if (!value) return setError("Enter your email address to continue.");
    if (!/^\S+@\S+\.\S+$/.test(value)) return setError("Enter a valid email address.");
    setDigits(["", "", "", "", "", ""]);
    go("verify");
  };

  const submitCode = () => {
    if (digits.join("") !== DEMO_CODE) return setError(`That code is not correct. Use demo code ${DEMO_CODE}.`);
    go("done");
  };

  const setDigit = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => prev.map((item, i) => (i === index ? digit : item)));
    setError("");
    if (digit && index < 5) boxes.current[index + 1]?.focus();
  };
  const onDigitKey = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) boxes.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) boxes.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) boxes.current[index + 1]?.focus();
  };
  const onPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, i) => pasted[i] ?? ""));
    setError("");
    boxes.current[Math.min(pasted.length, 5)]?.focus();
  };

  const h = (text: string, serif: boolean, size = "text-[28px]") => (
    <h1 ref={heading} tabIndex={-1} className={`${serif ? `font-display italic ${size}` : "font-ui text-[23px]"} font-bold leading-[1.15] tracking-normal text-forest focus:outline-none`}>{text}</h1>
  );

  return (
    <>
      <AuthBackdrop className="min-h-dvh pb-24">
        <div className="px-4 pt-4">
          <Link to="/" className="inline-flex min-h-11 items-center text-[15px] font-semibold text-forest">Back to home page</Link>
        </div>
        <img src={logoGccColor} alt="Growth Consulting Club" className="mx-auto mt-[58px] w-[268px] max-w-[calc(100%-48px)]" />

        <div className="px-5">
          {step === "signin" && (
            <Card>
              {h("Sign in to GCC", true)}
              <p className="mt-5 max-w-[240px] text-sm font-medium leading-[22px]">Welcome back! Sign in to continue your learning journey.</p>
              <form noValidate onSubmit={(event) => { event.preventDefault(); submitEmail(); }}>
                <label htmlFor="login-email" className="mt-8 block text-[13px] font-semibold">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  value={email}
                  onFocus={(event) => {
                    if (email) return;
                    // Fill the demo email but keep it selected so typing replaces it instead of appending.
                    const field = event.currentTarget;
                    setEmail(DEMO_EMAIL);
                    requestAnimationFrame(() => field.select());
                  }}
                  onChange={(event) => { setEmail(event.target.value); setError(""); }}
                  aria-invalid={error ? true : undefined}
                  aria-describedby="login-email-note"
                  className={`${input} mt-2.5 ${error ? "border-berry" : "border-[#dde3df]"}`}
                />
                <p id="login-email-note" className={`mt-3 ${note} ${error ? "text-berry" : ""}`} role={error ? "alert" : undefined}>{error || "Prototype: tap the field to use a demo email."}</p>
                <button type="submit" className={`${primary} mt-5 ${error ? "!border-[#718b7b] !bg-[#718b7b]" : ""}`}>Continue</button>
                <div className="my-5 flex items-center gap-3 text-xs font-medium" aria-hidden="true">
                  <span className="h-px flex-1 bg-[#e2e8e4]" />or<span className="h-px flex-1 bg-[#e2e8e4]" />
                </div>
                <button type="button" onClick={() => jump("google")} className={secondary}>Continue with Google</button>
              </form>
              <p className="mt-5 flex justify-between px-3.5 text-xs font-medium">
                <span>Don’t have an account?</span>
                <button type="button" onClick={() => jump("signup")} className="font-semibold text-teal-deep">Sign up</button>
              </p>
            </Card>
          )}

          {step === "verify" && (
            <Card>
              {h("Check your email", true)}
              <p className="mt-5 max-w-[260px] text-sm font-medium leading-6">Enter the 6-digit verification code for <span className="block font-semibold text-teal-deep">{email.trim() || DEMO_EMAIL}</span></p>
              <form noValidate onSubmit={(event) => { event.preventDefault(); submitCode(); }}>
                <fieldset className="mt-9">
                  <legend className="sr-only">6-digit verification code</legend>
                  <div className="grid grid-cols-6 gap-1.5">
                    {digits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { boxes.current[index] = el; }}
                        value={digit}
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        aria-label={`Digit ${index + 1}`}
                        aria-invalid={error ? true : undefined}
                        onChange={(event) => setDigit(index, event.target.value)}
                        onKeyDown={(event) => onDigitKey(index, event)}
                        onPaste={onPaste}
                        className={`h-[54px] w-full rounded-lg border bg-[#f2f6f3] text-center text-xl font-semibold text-forest focus:border-brand-blue ${error ? "border-berry" : "border-[#d6ded9]"}`}
                      />
                    ))}
                  </div>
                </fieldset>
                <p className={`mt-4 ${note} ${error ? "text-berry" : ""}`} role={error ? "alert" : undefined}>{error || `Demo code: ${DEMO_CODE} · no email is sent.`}</p>
                <button type="submit" className={`${primary} mt-6`}>Verify and continue</button>
                <button type="button" onClick={() => jump("resend")} className={`${secondary} mt-4`}>Resend code</button>
              </form>
              <button type="button" onClick={() => { setEmail(""); jump("signin"); }} className="mx-auto mt-8 block text-sm font-semibold text-teal-deep">Use a different email</button>
            </Card>
          )}

          {step === "google" && (
            <Card>
              {h("Continue with Google", false)}
              <p className="mt-6 text-sm font-medium leading-6">Preview the Google sign-in journey. This screen uses a demo account.</p>
              <div className="mt-9 rounded-xl bg-[#eef3ee] px-5 py-4">
                <p className="text-base font-semibold">GCC demo account</p>
                <p className="mt-2 text-[13px] font-medium text-forest/80">{DEMO_EMAIL}</p>
              </div>
              <button type="button" onClick={() => { setEmail(DEMO_EMAIL); go("done"); }} className={`${primary} mt-9`}>Continue with demo account</button>
              <button type="button" onClick={() => jump("signin")} className={`${secondary} mt-5`}>Back to sign in</button>
              <p className={`mt-9 ${note}`}>No Google credentials are requested.</p>
            </Card>
          )}

          {step === "signup" && (
            <Card>
              {h("Create Your GCC Account", false)}
              <p className="mt-6 text-[13px] font-medium">Start your learning journey with GCC.</p>
              <form noValidate onSubmit={(event) => { event.preventDefault(); setEmail((value) => value.trim() || DEMO_EMAIL); go("done"); }}>
                <label htmlFor="signup-name" className="mt-6 block text-[13px] font-semibold">Full name</label>
                <input id="signup-name" autoComplete="name" value={name || DEMO_NAME} onChange={(event) => setName(event.target.value)} className={`${input} mt-2 border-[#d6ded9] bg-[#f2f6f3]`} />
                <label htmlFor="signup-email" className="mt-4 block text-[13px] font-semibold">Email address</label>
                <input id="signup-email" type="email" autoComplete="email" value={email || DEMO_EMAIL} onChange={(event) => setEmail(event.target.value)} className={`${input} mt-2 border-[#d6ded9] bg-[#f2f6f3]`} />
                <p className={`mt-3 ${note}`}>Demo details are prefilled for this prototype.</p>
                <button type="submit" className={`${primary} mt-4`}>Create Account</button>
              </form>
              <button type="button" onClick={() => jump("signin")} className={`${secondary} mt-5`}>Already have an account? Sign in</button>
            </Card>
          )}

          {step === "done" && (
            <Card>
              {h("You’re signed in", true, "text-[26px]")}
              <p className="mt-10 font-ui text-[17px] font-bold leading-6">Welcome to GCC.</p>
              <p className="mt-4 text-sm font-medium">Your demo sign-in is complete.</p>
              <div className="mt-9 rounded-xl bg-[#eef3ee] px-5 py-4">
                <p className="text-sm font-semibold text-teal-deep">{email.trim() || DEMO_EMAIL}</p>
                <p className="mt-2 text-xs font-medium text-forest/80">Prototype account</p>
              </div>
              <button type="button" onClick={() => go("home")} className={`${primary} mt-9`}>Continue to homepage</button>
              <p className={`mt-12 ${note}`}>No real account has been created.</p>
            </Card>
          )}

          {step === "resend" && (
            <Card>
              {h("Code ready to resend", false)}
              <p className="mt-8 text-xs font-medium">In the live app, a new email would be sent.</p>
              <p className="mt-5 text-xs font-medium">For this prototype, use demo code {DEMO_CODE}.</p>
              <button type="button" onClick={() => jump("verify")} className={`${primary} mt-[104px]`}>Back to verification</button>
              <p className={`mt-24 ${note}`}>No email is sent from this prototype.</p>
            </Card>
          )}
        </div>
      </AuthBackdrop>
      {loading && <LoadingScreen />}
    </>
  );
}
