import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

export const LanguagesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-serif text-foreground text-center mb-4">
            {t('languages.title')}
          </h2>
          <div className="w-16 h-0.5 bg-gold mx-auto mb-10" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {[
              { flag: "🇬🇧", label: "English" },
              { flag: "🇪🇸", label: "Español" },
              { flag: "🇧🇷", label: "Português" },
            ].map((lang) => (
              <div key={lang.label} className="flex items-center gap-3 px-6 md:px-7 py-3 md:py-4 rounded-full border border-border bg-card text-foreground text-base md:text-lg font-medium">
                <span className="text-xl md:text-2xl">{lang.flag}</span>
                {lang.label}
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-[15px] max-w-xl mx-auto">
            {t('languages.desc')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LanguagesSection;
