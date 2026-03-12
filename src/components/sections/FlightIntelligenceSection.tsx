// FlightIntelligenceSection.tsx
import { Plane, Timer, BarChart3 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

export const FlightIntelligenceSection = () => {
  const { t } = useLanguage();

  const tableData = [
    { name: "María García", flight: "LA182", statusKey: 'flight.scheduled', statusColor: "text-green-400", departure: "17:46", wait: "4 min", group: "2" },
    { name: "Carlos López", flight: "AA468", statusKey: 'flight.delayed', statusColor: "text-amber-400", departure: "19:30", wait: "8 min", group: "1" },
    { name: "Ana Rodríguez", flight: "IB3420", statusKey: 'flight.boarding', statusColor: "text-red-400", departure: "15:15", wait: "12 min", group: "3" },
  ];

  const values = [
    { icon: Plane, titleKey: 'flight.val.1.title', descKey: 'flight.val.1.desc' },
    { icon: Timer, titleKey: 'flight.val.2.title', descKey: 'flight.val.2.desc' },
    { icon: BarChart3, titleKey: 'flight.val.3.title', descKey: 'flight.val.3.desc' },
  ];

  return (
    <section className="py-28 bg-accent text-accent-foreground">
      <div className="container mx-auto px-6">
        <ScrollReveal>
          <h2 className="text-4xl md:text-5xl font-serif text-center mb-4 text-white">
            {t('flight.title')}
          </h2>
          <p className="text-center text-white/80 text-xl font-serif mb-3">{t('flight.subtitle')}</p>
          <div className="w-20 h-0.5 bg-gold mx-auto mb-8" />
          <p className="text-center max-w-3xl mx-auto mb-16 text-[15px] leading-relaxed text-white/75">
            {t('flight.desc')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="-mx-6 px-6 overflow-x-auto mb-16 md:mx-0 md:px-0">
            <div className="rounded-xl overflow-hidden border min-w-[640px] max-w-5xl mx-auto" style={{ borderColor: 'rgba(255,255,255,0.12)', backgroundColor: 'rgba(255,255,255,0.04)' }}>
              <div className="grid grid-cols-6 gap-4 p-5 text-xs font-semibold uppercase tracking-wider text-white/60" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <span>{t('flight.col.passenger')}</span>
                <span>{t('flight.col.flight')}</span>
                <span>{t('flight.col.status')}</span>
                <span>{t('flight.col.departure')}</span>
                <span>{t('flight.col.wait')}</span>
                <span>{t('flight.col.group')}</span>
              </div>
              {tableData.map((row) => (
                <div key={row.name} className="grid grid-cols-6 gap-4 p-5 text-[15px] transition-colors text-white/90" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="font-medium">{row.name}</span>
                  <span className="font-mono text-white/70">{row.flight}</span>
                  <span className={row.statusColor}>{t(row.statusKey)}</span>
                  <span>{row.departure}</span>
                  <span>{row.wait}</span>
                  <span className="text-center">{row.group}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {values.map((value, index) => (
            <ScrollReveal key={value.titleKey} delay={index * 0.1}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-5">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-serif mb-3 text-white">{t(value.titleKey)}</h3>
                <p className="text-[15px] leading-relaxed text-white/65">{t(value.descKey)}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlightIntelligenceSection;
