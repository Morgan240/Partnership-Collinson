import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const HowItWorksSection = () => {
  const { t } = useLanguage();

  const steps = [
    { number: "01", titleKey: 'steps.1.title', descKey: 'steps.1.desc' },
    { number: "02", titleKey: 'steps.2.title', descKey: 'steps.2.desc' },
    { number: "03", titleKey: 'steps.3.title', descKey: 'steps.3.desc' },
    { number: "04", titleKey: 'steps.4.title', descKey: 'steps.4.desc' },
    { number: "05", titleKey: 'steps.5.title', descKey: 'steps.5.desc' },
  ];

  return (
    <section id="como-funciona" className="py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('steps.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-20" />
        </ScrollReveal>

        <div className="max-w-4xl mx-auto space-y-0">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.1}>
              <div className="flex gap-8 md:gap-10 group">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-navy/10 border-2 border-navy flex items-center justify-center flex-shrink-0 group-hover:bg-navy transition-colors duration-300">
                    <span className="text-navy font-serif text-lg md:text-xl font-bold group-hover:text-white transition-colors duration-300">
                      {step.number}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-px h-full min-h-[40px] bg-border my-3" />
                  )}
                </div>
                <div className="pb-12 md:pb-14">
                  <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3">{t(step.titleKey)}</h3>
                  <p className="text-secondary-foreground leading-relaxed text-[15px]">{t(step.descKey)}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
