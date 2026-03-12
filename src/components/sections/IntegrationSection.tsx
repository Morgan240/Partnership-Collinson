import { Check } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import collinsonLogo from "@/assets/CIL-Logo-white.svg";

const IntegrationSection = () => {
  const { t } = useLanguage();

  const integrationKeys = [
    'integration.1', 'integration.2', 'integration.3', 'integration.4', 'integration.5',
  ];

  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('integration.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-16" />
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-2xl mx-auto space-y-3 mb-16">
            {integrationKeys.map((key) => (
              <div key={key} className="flex items-center gap-4 p-5 bg-card rounded-xl border border-border">
                <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-navy" />
                </div>
                <span className="text-foreground text-[15px] font-medium">{t(key)}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="text-center">
            <p className="text-muted-foreground text-xs mb-5 uppercase tracking-widest">{t('integration.badge')}</p>
            <img src={collinsonLogo} alt="Collinson Group" className="w-[70%] md:max-w-sm mx-auto" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IntegrationSection;
