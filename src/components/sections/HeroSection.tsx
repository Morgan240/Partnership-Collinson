import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";
import { motion } from "framer-motion";

import heroImage from "@/assets/hero-lounge.jpg";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-[70px]">
      {/* Background image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImage})` }} />

      {/* Noise texture overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-dark-overlay" />

      {/* Subtle radial glow from top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(124,185,232,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        <ScrollReveal delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] mb-8 px-4 py-2 rounded-full border border-white/20 text-white/60">
              Collinson Waitlist Solution
            </span>
          </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif leading-[1.1] mb-8 max-w-5xl mx-auto text-white">
            {t('hero.heading.1')}{" "}
            <span
              style={{
                WebkitTextFillColor: 'transparent',
                background: 'linear-gradient(135deg, #7CB9E8, #B0D4F1)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              {t('hero.heading.2')}
            </span>
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.25}>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light" style={{ color: 'rgba(255,255,255,0.82)' }}>
            {t('hero.subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.35}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="bg-magenta-gradient text-white font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 text-lg px-10 py-4 rounded-md">
              {t('hero.cta')}
            </button>
            <a
              href="#como-funciona"
              className="text-lg tracking-wide transition-colors"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {t('hero.secondary')}
            </a>
          </div>
        </ScrollReveal>

        {/* Scroll indicator */}
        <ScrollReveal delay={0.5}>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <div className="w-px h-12 bg-white animate-pulse" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HeroSection;
