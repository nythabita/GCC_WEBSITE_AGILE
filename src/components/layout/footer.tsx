import { Link } from "react-router";
import { logoGccWhite } from "../../assets/brand";
import { footerNavigation } from "../../data/navigation";

const contact = {
  email: "consultanttogether@gmail.com",
  instagramHandle: "@growthconsulting.c",
  instagramUrl: "https://www.instagram.com/growthconsulting.c",
};

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-teal-deep bg-brand-green text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-6 pb-0 pt-6 md:grid-cols-[1.4fr_1fr_1.2fr] md:gap-12 md:px-8 md:pt-12">
        <div>
          <Link to="/" aria-label="Growth Consulting — Beranda" className="inline-block">
            <img src={logoGccWhite} alt="Growth Consulting" width={146} height={51} className="block h-auto w-[146px]" />
          </Link>
          <p className="mt-3 max-w-[342px] text-sm leading-snug">
            Komunitas pengembangan profesional bagi mahasiswa yang ingin mengenal dan mengeksplorasi industri consulting.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-sage">Kontak</h2>
          <ul className="mt-3 flex flex-col gap-2 text-[13px]">
            <li><a href={`mailto:${contact.email}`} className="underline-offset-4 hover:underline">{contact.email}</a></li>
            <li><a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">{contact.instagramHandle}</a></li>
          </ul>
        </div>

        <div className="border-t border-sage/30 pt-5 md:border-t-0 md:pt-0">
          <h2 className="text-sm font-semibold text-sage">Navigasi</h2>
          <ul className="mt-2 grid grid-cols-2 text-sm font-semibold">
            {footerNavigation.map((item) => (
              <li key={item.label}>
                <Link to={item.path} className="flex min-h-[42px] items-center hover:underline hover:underline-offset-4">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
        <p className="border-t border-sage/30 py-2 text-[11px] text-sage">Growth Consulting Club</p>
      </div>
    </footer>
  );
}
