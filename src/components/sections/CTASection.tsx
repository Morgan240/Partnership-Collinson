import { useState } from "react";
import emailjs from "@emailjs/browser";
import ScrollReveal from "@/components/ScrollReveal";
import { useLanguage } from "@/i18n/LanguageContext";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "service_fttktt8";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "template_8v7g6po";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "ih4ToboDHWu8hb4fI";
const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL;

const CTASection = () => {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setStatus("loading");

    try {
      const tasks: Promise<unknown>[] = [
        emailjs.send(
          SERVICE_ID,
          TEMPLATE_ID,
          { name, email, phone, time: new Date().toLocaleString() },
          PUBLIC_KEY
        ),
      ];
      if (SHEETS_URL) {
        tasks.push(
          fetch(SHEETS_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({ name, email, phone }),
          })
        );
      }
      await Promise.all(tasks);

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="cta" className="py-28 bg-accent relative overflow-hidden">
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
          {status === "success" ? (
            <div className="max-w-lg mx-auto text-center py-10">
              <p className="text-white text-xl font-semibold">{t('cta.success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
              <input
                type="text"
                placeholder={t('cta.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full h-14 px-5 text-base rounded-xl border-2 bg-white/8 text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' }}
              />
              <input
                type="email"
                placeholder={t('cta.email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-14 px-5 text-base rounded-xl border-2 text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' }}
              />
              <input
                type="tel"
                placeholder={t('cta.phone')}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full h-14 px-5 text-base rounded-xl border-2 text-white placeholder-white/40 outline-none focus:border-white/40 transition-colors"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.2)' }}
              />
              {status === "error" && (
                <p className="text-red-300 text-sm text-center">{t('cta.error')}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full h-14 font-semibold text-[17px] rounded-xl bg-magenta-gradient text-white shadow-lg hover:shadow-xl hover:brightness-110 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "..." : t('cta.submit')}
              </button>
            </form>
          )}
          <p className="text-center text-sm mt-8 text-white/50">
            {t('cta.note')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
