import { useLanguage } from "@/i18n/LanguageContext";
import collinsonLogoWhite from "@/assets/CIL-Logo.svg";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-14 bg-accent text-accent-foreground">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center gap-7">
          <img src={collinsonLogoWhite} alt="Collinson Group" className="h-14" />
          <p className="text-sm text-white/50">{t('footer.copyright')}</p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-white/45 hover:text-white transition-colors">{t('footer.terms')}</a>
            <a href="#" className="text-white/45 hover:text-white transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="text-white/45 hover:text-white transition-colors">{t('footer.contact')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
