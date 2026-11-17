import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { ArrowRight, Check, ChevronDown, Menu, X } from "lucide-react";
import { getSectionLabel, isPathActive, navigation, secondaryNavigation } from "../../data/navigation";
import { logoGccColor } from "../../assets/brand";
import { buttonStyles } from "../UI/button-styles";

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
  `inline-flex min-h-11 items-center border-b-2 px-1 text-[15px] font-semibold transition-colors duration-150 ${isActive ? "border-teal-deep text-nav-ink" : "border-transparent text-nav-ink/70 hover:text-nav-ink"}`;

const drawerLinkClass = "flex min-h-12 flex-1 items-center rounded-xl px-4 text-[15px] font-medium text-nav-ink";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { pathname } = useLocation();
  const sectionLabel = getSectionLabel(pathname);
  const close = () => setIsOpen(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setIsOpen(false); };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onBreakpoint = () => { if (desktop.matches) setIsOpen(false); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-nav-line bg-paper-soft">
      <nav aria-label="Navigasi utama" className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link to="/" className="shrink-0 rounded-lg" onClick={close}>
          <img src={logoGccColor} alt="Growth Consulting — Beranda" width={110} height={37} className="block h-auto w-[110px] md:w-[124px]" />
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-5">
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} end={item.path === "/"} className={desktopLinkClass}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
          <ul className="flex items-center gap-5">
            {secondaryNavigation.map((item) => (
              <li key={item.path}>
                <NavLink to={item.path} className={desktopLinkClass}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
          <Link to="/programs" className={buttonStyles({ variant: "rose", size: "sm" })}>Jelajahi Program</Link>
        </div>

        {/* Mobile: current section + menu button */}
        <div className="flex items-center gap-5 lg:hidden">
          <span className="relative pb-1.5 text-[13px] font-semibold text-nav-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-teal-deep">
            {sectionLabel}
          </span>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-xl border border-nav-line bg-paper-soft text-nav-ink"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden">
          <button type="button" aria-label="Tutup menu" tabIndex={-1} className="fixed inset-x-0 bottom-0 top-20 bg-black/30" onClick={close} />
          <nav
            id="mobile-navigation"
            aria-label="Navigasi mobile"
            className="fixed bottom-0 left-0 top-20 w-[78%] max-w-xs overflow-y-auto border-r border-nav-line bg-paper-soft px-4 pb-8 pt-6"
          >
            <ul className="flex flex-col gap-2">
              {navigation.map((item) => {
                const active = isPathActive(pathname, item.path);
                const submenuId = `submenu-${item.label.toLowerCase()}`;
                const submenuOpen = expanded === item.label;
                return (
                  <li key={item.path}>
                    <div className={`relative flex items-center rounded-xl ${active ? "bg-mint" : ""}`}>
                      {active && <span aria-hidden="true" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-teal-active" />}
                      <NavLink to={item.path} end={item.path === "/"} onClick={close} className={`${drawerLinkClass} ${active ? "font-semibold text-teal-deep" : ""}`}>
                        {item.label}
                      </NavLink>
                      {active && <Check size={16} aria-hidden="true" className="mr-1 text-teal-deep" />}
                      {item.children && (
                        <button
                          type="button"
                          className="flex size-11 items-center justify-center text-nav-ink"
                          aria-label={`Submenu ${item.label}`}
                          aria-expanded={submenuOpen}
                          aria-controls={submenuId}
                          onClick={() => setExpanded(submenuOpen ? null : item.label)}
                        >
                          <ChevronDown size={18} aria-hidden="true" className={`transition-transform duration-150 ${submenuOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {item.children && submenuOpen && (
                      <ul id={submenuId} className="ml-6 mt-1 flex flex-col border-l border-nav-line pl-2">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link to={child.path} onClick={close} className="flex min-h-11 items-center rounded-lg px-3 text-sm text-nav-ink hover:bg-mint">{child.label}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-col gap-3">
              <Link to="/programs" onClick={close} className={buttonStyles({ variant: "rose", size: "md", fullWidth: true, className: "text-sm" })}>
                <span className="flex-1 text-center">Jelajahi Program</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/assessment" onClick={close} className={buttonStyles({ variant: "outline", size: "md", fullWidth: true, className: "border-teal-deep text-sm" })}>
                <span className="flex-1 text-center">Temukan Jalurmu</span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-4 text-xs leading-snug text-nav-ink/70">Pilih halaman atau tutup menu untuk melanjutkan.</p>

            <ul className="mt-5 flex flex-col">
              {secondaryNavigation.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} onClick={close} className="flex min-h-11 items-center text-sm font-semibold text-teal-deep">{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
