import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const ResultsSection = () => {
  const { t } = useLanguage();

  const metrics = [
    { valueKey: 'results.1.value', labelKey: 'results.1.label', descKey: 'results.1.desc' },
    { valueKey: 'results.2.value', labelKey: 'results.2.label', descKey: 'results.2.desc' },
    { valueKey: 'results.3.value', labelKey: 'results.3.label', descKey: 'results.3.desc' },
  ];

  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('results.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-20" />
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12 max-w-5xl mx-auto">
          {metrics.map((metric, index) => (
            <ScrollReveal key={metric.labelKey} delay={index * 0.15}>
              <div className="text-center">
                <div className="text-6xl md:text-7xl font-serif font-bold text-navy mb-4">
                  {t(metric.valueKey)}
                </div>
                <h3 className="text-lg md:text-xl font-serif text-foreground mb-3">{t(metric.labelKey)}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{t(metric.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <p className="text-center text-muted-foreground text-sm mt-14 italic max-w-2xl mx-auto">
            {t('results.disclaimer')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ResultsSection;
