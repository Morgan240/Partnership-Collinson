import { QrCode, CreditCard, Bell, ListOrdered, RotateCcw, Settings } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    { icon: QrCode, titleKey: 'features.1.title', descKey: 'features.1.desc' },
    { icon: CreditCard, titleKey: 'features.2.title', descKey: 'features.2.desc' },
    { icon: Bell, titleKey: 'features.3.title', descKey: 'features.3.desc' },
    { icon: ListOrdered, titleKey: 'features.4.title', descKey: 'features.4.desc' },
    { icon: RotateCcw, titleKey: 'features.5.title', descKey: 'features.5.desc' },
    { icon: Settings, titleKey: 'features.6.title', descKey: 'features.6.desc' },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('features.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-20" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal key={feature.titleKey} delay={index * 0.08}>
              <div className="p-7 md:p-8 rounded-xl border border-border hover:border-navy/30 hover:shadow-lg transition-all duration-300 h-full bg-card">
                <div className="w-12 h-12 rounded-lg bg-navy/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-navy" />
                </div>
                <h3 className="text-[19px] font-serif text-foreground mb-3 leading-snug">{t(feature.titleKey)}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{t(feature.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
