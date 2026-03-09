import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-accent relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-5 text-white">
            {t('cta.title')}
          </h2>
          <p className="text-center text-lg md:text-xl max-w-2xl mx-auto mb-14 text-white/80">
            {t('cta.subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="max-w-lg mx-auto space-y-4">
            <input
              type="text"
              placeholder={t('cta.name')}
              className="w-full h-14 px-5 text-base rounded-xl border-2 bg-white/8 text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' }}
            />
            <input
              type="email"
              placeholder={t('cta.email')}
              className="w-full h-14 px-5 text-base rounded-xl border-2 text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' }}
            />
            <button className="w-full h-14 font-semibold text-[17px] rounded-xl bg-magenta-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300">
              {t('cta.submit')}
            </button>
          </div>
          <p className="text-center text-sm mt-8 text-white/50">
            {t('cta.note')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
