import { Shield, ClipboardList, Lock } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const OperationalModelSection = () => {
  const { t } = useLanguage();

  const principles = [
    { icon: Shield, titleKey: 'model.1.title', descKey: 'model.1.desc' },
    { icon: ClipboardList, titleKey: 'model.2.title', descKey: 'model.2.desc' },
    { icon: Lock, titleKey: 'model.3.title', descKey: 'model.3.desc' },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('model.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-14" />
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <blockquote className="max-w-3xl mx-auto text-center mb-20 px-4 md:px-8">
            <div className="border-l-4 border-gold pl-6 md:pl-8 text-left">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-serif italic">
                {t('model.quote')}
              </p>
            </div>
          </blockquote>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {principles.map((p, index) => (
            <ScrollReveal key={p.titleKey} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center mx-auto mb-5">
                  <p.icon className="w-8 h-8 text-navy" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-3">{t(p.titleKey)}</h3>
                <p className="text-muted-foreground text-[15px] leading-relaxed">{t(p.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OperationalModelSection;
