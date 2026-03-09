import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

import screenLms from "@/assets/screen-lms-waitlist.png";
import screenGroupSelect from "@/assets/screen-group-select.png";
import screenQueuePosition from "@/assets/screen-queue-position.png";
import screenYourTurn from "@/assets/screen-your-turn.png";

const ScreensSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-28 bg-secondary">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-foreground text-center mb-4">
            {t('screens.title')}
          </h2>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-6" />
          <p className="text-center text-secondary-foreground text-lg max-w-2xl mx-auto mb-20">
            {t('screens.subtitle')}
          </p>
        </ScrollReveal>

        {/* Staff Interface */}
        <ScrollReveal delay={0.1}>
          <div className="max-w-6xl mx-auto mb-24 md:mb-28">
            <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">
              <div className="w-full lg:w-2/5">
                <span className="text-brand-magenta text-xs font-semibold uppercase tracking-widest">{t('screens.staff.label')}</span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mt-3 mb-5">
                  {t('screens.staff.title')}
                </h3>
                <p className="text-secondary-foreground leading-relaxed text-[15px] mb-6">
                  {t('screens.staff.desc')}
                </p>
                <ul className="space-y-3 text-[15px] text-secondary-foreground">
                  {['screens.staff.1', 'screens.staff.2', 'screens.staff.3', 'screens.staff.4'].map((key) => (
                    <li key={key} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-navy flex-shrink-0" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-3/5">
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border bg-card">
                  <img src={screenLms} alt={t('screens.staff.title')} className="w-full h-auto" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Passenger Interface */}
        <ScrollReveal delay={0.15}>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-12">
              <div className="w-full lg:w-2/5">
                <span className="text-brand-magenta text-xs font-semibold uppercase tracking-widest">{t('screens.pax.label')}</span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground mt-3 mb-5">
                  {t('screens.pax.title')}
                </h3>
                <p className="text-secondary-foreground leading-relaxed text-[15px] mb-6">
                  {t('screens.pax.desc')}
                </p>
                <ul className="space-y-3 text-[15px] text-secondary-foreground">
                  {['screens.pax.1', 'screens.pax.2', 'screens.pax.3', 'screens.pax.4'].map((key) => (
                    <li key={key} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-navy flex-shrink-0" />
                      {t(key)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-full lg:w-3/5">
                {/* Mobile screens with perspective tilt and staggered heights */}
                <div className="flex items-end justify-center gap-3 md:gap-5">
                  <div
                    className="w-[30%] max-w-[140px] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
                    style={{ transform: 'rotate(-3deg) translateY(8px)', boxShadow: '0 25px 50px rgba(0,45,81,0.25)' }}
                  >
                    <img src={screenGroupSelect} alt={t('screens.pax.1')} className="w-full h-auto" />
                  </div>
                  <div
                    className="w-[33%] max-w-[160px] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card z-10"
                    style={{ boxShadow: '0 30px 60px rgba(0,45,81,0.30)' }}
                  >
                    <img src={screenQueuePosition} alt={t('screens.pax.2')} className="w-full h-auto" />
                  </div>
                  <div
                    className="w-[30%] max-w-[140px] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card"
                    style={{ transform: 'rotate(3deg) translateY(8px)', boxShadow: '0 25px 50px rgba(0,45,81,0.25)' }}
                  >
                    <img src={screenYourTurn} alt={t('screens.pax.3')} className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ScreensSection;
