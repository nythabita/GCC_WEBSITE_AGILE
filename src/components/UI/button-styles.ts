type ButtonVariant = "primary" | "secondary" | "ghost" | "rose" | "paper" | "white" | "outline" | "berry" | "berry-soft" | "sun";
type ButtonSize = "sm" | "md" | "lg" | "xl";

export type ButtonStyleOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
};

const legacyFont = "font-brand font-medium";
const uiFont = "font-ui font-semibold";

const variants: Record<ButtonVariant, string> = {
  primary: `${legacyFont} border-brand-red bg-brand-red text-white hover:border-brand-red-hover hover:bg-brand-red-hover active:border-brand-red-active active:bg-brand-red-active`,
  secondary: `${legacyFont} border-brand-red bg-transparent text-brand-red hover:bg-brand-cream active:bg-brand-cream/70`,
  ghost: `${legacyFont} border-transparent bg-transparent text-ink hover:bg-brand-cream active:bg-brand-cream/70`,
  // Homepage variants from the Figma design.
  rose: `${uiFont} border-rose bg-rose text-white hover:border-rose-hover hover:bg-rose-hover active:border-rose-active active:bg-rose-active`,
  paper: `${uiFont} border-paper bg-paper text-forest hover:border-white hover:bg-white`,
  white: `${uiFont} border-white bg-white text-black hover:border-paper hover:bg-paper`,
  berry: `${uiFont} border-berry bg-berry text-white hover:border-berry-hover hover:bg-berry-hover active:bg-berry-hover`,
  "berry-soft": `${uiFont} border-mint-pale bg-mint-pale text-forest hover:border-sage hover:bg-sage`,
  sun: `${uiFont} border-sun bg-sun text-black hover:brightness-95`,
  outline: `${uiFont} border-forest bg-transparent text-forest hover:bg-mint active:bg-mint/70`,
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-2 text-base",
  md: "min-h-12 px-6 py-3 text-base",
  lg: "min-h-13 px-8 py-3 text-base",
  xl: "min-h-13 px-8 py-3 text-xl",
};

// Share presentation with Link/anchor while preserving native navigation semantics.
export function buttonStyles({ variant = "primary", size = "md", fullWidth = false, className = "" }: ButtonStyleOptions = {}) {
  return [
    "inline-flex min-w-11 items-center justify-center gap-2 rounded-lg border text-center leading-[1.4] transition-colors duration-150 disabled:pointer-events-none disabled:border-line disabled:bg-line disabled:text-muted disabled:cursor-not-allowed",
    variants[variant], sizes[size], fullWidth ? "w-full" : "", className,
  ].filter(Boolean).join(" ");
}
