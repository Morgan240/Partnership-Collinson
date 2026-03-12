import { useLanguage } from "@/i18n/LanguageContext";
import type { Language } from "@/i18n/translations";
import collinsonLogoWhite from "@/assets/CIL-Logo-white-on-blue.svg";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const langs: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
  ];

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full px-1 py-1">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => setLanguage(l.code)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
            language === l.code
              ? 'bg-white text-navy'
              : 'text-white/70 hover:text-white'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-gradient backdrop-blur-sm" style={{ height: '70px' }}>
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <img src={collinsonLogoWhite} alt="Collinson Group" className="h-12" />
        <LanguageSwitcher />
      </div>
    </nav>
  );
};

export default Navbar;
