import { logoGccColor } from "../../assets/brand";
import { heroInternalTraining } from "../../assets/home";

// Splash/loading state from the "0. LOGIN TO HOMEPAGE" Figma export: the logo pulses in the centre of the faded
// background photo. The Figma file only has static keyframes, so the motion (opacity pulse, motion-safe only) is our reading of it.

export function AuthBackdrop({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative isolate overflow-hidden bg-white ${className}`}>
      {/* Placeholder photo: the original login background was not exported; swap when supplied. */}
      <img src={heroInternalTraining} alt="" aria-hidden="true" className="absolute inset-0 -z-20 size-full object-cover" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.96),rgba(255,255,255,0.88)_25%,rgba(255,255,255,0.86))]" />
      {children}
    </div>
  );
}

export default function LoadingScreen({ label = "Loading..." }: { label?: string }) {
  return (
    <AuthBackdrop className="fixed inset-0 z-50">
      <div className="flex min-h-dvh items-center justify-center px-6">
        <img src={logoGccColor} alt="" aria-hidden="true" className="w-[268px] max-w-full motion-safe:animate-pulse" />
        <p role="status" className="sr-only">{label}</p>
      </div>
    </AuthBackdrop>
  );
}
