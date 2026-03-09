import { Users, Clock, HelpCircle, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const ProblemsSection = () => {
  const { t } = useLanguage();

  const problems = [
    { icon: Users, titleKey: 'problems.1.title', descKey: 'problems.1.desc' },
    { icon: Clock, titleKey: 'problems.2.title', descKey: 'problems.2.desc' },
    { icon: HelpCircle, titleKey: 'problems.3.title', descKey: 'problems.3.desc' },
    { icon: BarChart3, titleKey: 'problems.4.title', descKey: 'problems.4.desc' },
  ];

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('problems.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-20" />
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-5xl mx-auto items-start">
          {problems.map((problem, index) => (
            <ScrollReveal key={problem.titleKey} delay={index * 0.1} className="h-full">
              <div className="bg-card p-8 md:p-9 rounded-xl border border-border hover:border-navy/30 transition-colors duration-300 shadow-sm flex flex-col h-full min-h-[220px]">
                <div className="w-14 h-14 rounded-full bg-navy/10 flex items-center justify-center mb-6 flex-shrink-0">
                  <problem.icon className="w-7 h-7 text-navy" />
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-foreground mb-3">{t(problem.titleKey)}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{t(problem.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;
