"use client";

import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  animate,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";

import type { Business } from "@/types/appwrite.types";

// ─── Assets ───────────────────────────────────────────────────────────────────

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1400&q=85";

const SERVICES = [
  {
    title: "Examen de Vue",
    tag: "Bilan visuel",
    body: "Contrôle complet réalisé par nos opticiens diplômés. Résultats immédiats, renouvellement d'ordonnance inclus.",
    image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?w=800&q=85",
  },
  {
    title: "Lunettes de Vue",
    tag: "Montures & Verres",
    body: "Large sélection de montures tendance et classiques. Verres progressifs, anti-reflet, photochromiques.",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=85",
  },
  {
    title: "Lentilles de Contact",
    tag: "Adaptation incluse",
    body: "Lentilles journalières, mensuelles et colorées. Essai gratuit et adaptation personnalisée sur rendez-vous.",
    image: "https://images.unsplash.com/photo-1512654527-6eecc26cadf5?w=800&q=85",
  },
  {
    title: "Lunettes Solaires",
    tag: "Correctrices & Tendance",
    body: "Solaires correctrices et non correctrices. Grandes marques et collections exclusives.",
    image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&q=85",
  },
];

const STATS = [
  { value: 15, suffix: " ans", label: "d'expérience" },
  { value: 2000, suffix: "+", label: "clients satisfaits" },
  { value: 50, suffix: "+", label: "marques disponibles" },
];

const STEPS = [
  { n: "01", title: "Réservez en ligne", body: "Choisissez votre prestation et un créneau. Confirmation instantanée par e-mail ou WhatsApp." },
  { n: "02", title: "Venez à votre rendez-vous", body: "Nos opticiens vous accueillent dans un espace moderne. Examen complet sans attente." },
  { n: "03", title: "Repartez avec votre correction", body: "Choisissez vos montures sur place. Livraison express ou récupération en boutique." },
];

// ─── Shared animation variants ────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease, delay },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease, delay },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.75, ease, delay },
  }),
};

// ─── Counter component ────────────────────────────────────────────────────────

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        if (ref.current)
          ref.current.textContent =
            Math.round(latest).toLocaleString("fr-FR") + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Section wrapper with reveal ─────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variant = direction === "left" ? fadeLeft : direction === "right" ? fadeRight : fadeUp;

  return (
    <motion.div
      ref={ref}
      variants={variant}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = { business: Business; businessId: string };

// ─── Component ────────────────────────────────────────────────────────────────

export function ChezRimLanding({ business, businessId }: Props) {
  const title = business.landingTitle || business.name;
  const description =
    business.landingDescription ||
    "Votre opticien de confiance. Examen de vue, lunettes et lentilles — avec prise en charge mutuelle.";
  const accent = business.primaryColor ?? "#0d2340";
  const city = business.city ?? "Maroc";

  const [activeService, setActiveService] = useState(0);

  // Hero parallax
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0d1a2d]">

      {/* ── Fixed nav ── */}
      <motion.header
        className="fixed left-0 right-0 top-0 z-50"
        style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          {business.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="h-8 w-auto max-w-[140px] object-contain" />
          ) : (
            <span className="text-base font-bold tracking-tight" style={{ color: accent }}>
              {business.name}
            </span>
          )}
          <nav className="hidden items-center gap-7 text-sm font-medium text-gray-500 md:flex">
            <a href="#services" className="transition hover:text-gray-900">Services</a>
            <a href="#processus" className="transition hover:text-gray-900">Comment ça marche</a>
            <a href="#contact" className="transition hover:text-gray-900">Contact</a>
          </nav>
          <Link
            href={`/b/${businessId}/services`}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-85 active:scale-95"
            style={{ backgroundColor: accent }}
          >
            Prendre RDV
          </Link>
        </div>
      </motion.header>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1 — HERO  (dark navy, full-screen)
      ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-[100svh] items-end overflow-hidden"
        style={{ background: accent }}
      >
        {/* Parallax image */}
        <motion.div className="absolute inset-0 scale-110" style={{ y: heroImgY }}>
          <img src={business.heroImageUrl ?? HERO_IMAGE} alt="" className="h-full w-full object-cover opacity-30" />
        </motion.div>

        {/* Noise / grain texture overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
          aria-hidden
        />

        <motion.div
          className="relative z-10 w-full px-5 pb-16 pt-32 sm:px-8 sm:pb-24 lg:pb-28"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <div className="mx-auto max-w-7xl">
            {/* Eyebrow */}
            <Reveal delay={0.1}>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                Opticien · {city}
              </p>
            </Reveal>

            {/* Giant headline */}
            <Reveal delay={0.2}>
              <h1
                className="font-serif font-semibold leading-[0.95] tracking-tight text-white"
                style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
              >
                {title}
              </h1>
            </Reveal>

            {/* Divider line */}
            <Reveal delay={0.35}>
              <div className="my-8 h-px w-16 bg-white/20" />
            </Reveal>

            {/* Description + CTAs */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <Reveal delay={0.4} className="max-w-md">
                <p className="text-base leading-relaxed text-white/60 sm:text-lg">{description}</p>
              </Reveal>
              <Reveal delay={0.5}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/b/${businessId}/services`}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold transition hover:bg-white/90 active:scale-95"
                    style={{ color: accent }}
                  >
                    Prendre rendez-vous
                    <span aria-hidden>→</span>
                  </Link>
                  <a
                    href="#services"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Découvrir
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 right-8 flex flex-col items-center gap-2 text-white/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ writingMode: "vertical-rl" }}>
            Défiler
          </span>
          <motion.div
            className="h-12 w-px bg-white/25"
            animate={{ scaleY: [0, 1, 0], originY: "top" }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2 — STATS  (cream/light, editorial)
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#f7f4ef] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
              En chiffres
            </p>
            <h2
              className="font-serif font-semibold leading-tight"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", color: accent }}
            >
              L'expertise au service<br className="hidden sm:block" /> de votre vision
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-0 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0" style={{ borderColor: "rgba(13,35,64,0.1)" }}>
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.12} className="py-10 sm:px-12 sm:py-0 first:pl-0">
                <p
                  className="font-serif font-bold leading-none tabular-nums"
                  style={{ fontSize: "clamp(3rem, 7vw, 6rem)", color: accent }}
                >
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-sm font-medium uppercase tracking-wider text-gray-500">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3 — SERVICES  (white, interactive split)
      ══════════════════════════════════════════════════════════════ */}
      <section id="services" className="scroll-mt-20 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
              Nos Prestations
            </p>
            <h2
              className="font-serif font-semibold"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: "#0d1a2d" }}
            >
              Ce que nous proposons
            </h2>
          </Reveal>

          {/* Desktop: interactive split — list left, image right */}
          <div className="mt-16 hidden lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Left — service list */}
            <div className="flex flex-col divide-y" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
              {SERVICES.map((s, i) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setActiveService(i)}
                  className="group flex items-center justify-between py-8 text-left transition-all"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 transition group-hover:text-gray-600">
                      {s.tag}
                    </p>
                    <p
                      className="mt-1 font-serif text-2xl font-semibold transition"
                      style={{ color: activeService === i ? accent : "#0d1a2d" }}
                    >
                      {s.title}
                    </p>
                    <motion.p
                      className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500"
                      initial={{ height: 0, opacity: 0 }}
                      animate={activeService === i ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease }}
                      style={{ overflow: "hidden" }}
                    >
                      {s.body}
                    </motion.p>
                  </div>
                  <span
                    className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm transition"
                    style={
                      activeService === i
                        ? { backgroundColor: accent, borderColor: accent, color: "white" }
                        : { borderColor: "rgba(0,0,0,0.12)", color: "#999" }
                    }
                  >
                    →
                  </span>
                </button>
              ))}
            </div>

            {/* Right — active image */}
            <div className="sticky top-24 h-fit overflow-hidden rounded-2xl">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease }}
                className="aspect-[4/5]"
              >
                <img
                  src={SERVICES[activeService].image}
                  alt={SERVICES[activeService].title}
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Mobile: simple stacked cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:hidden">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={s.image} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.tag}</p>
                    <h3 className="mt-1 font-serif text-lg font-semibold" style={{ color: "#0d1a2d" }}>{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="mt-12">
            <Link
              href={`/b/${businessId}/services`}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition hover:opacity-75"
              style={{ borderColor: accent, color: accent }}
            >
              Voir tous les services
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4 — PILLARS  (dark navy)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32" style={{ background: accent }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left — headline */}
            <Reveal direction="left">
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                Pourquoi nous choisir
              </p>
              <h2
                className="font-serif font-semibold leading-tight text-white"
                style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)" }}
              >
                L&apos;optique de qualité,<br /> accessible à tous
              </h2>
              <div className="mt-10">
                <Link
                  href={`/b/${businessId}/services`}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold transition hover:bg-white/90 active:scale-95"
                  style={{ color: accent }}
                >
                  Prendre rendez-vous
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>

            {/* Right — pillar rows */}
            <div className="flex flex-col gap-0 divide-y" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              {[
                { n: "01", label: "Opticiens Diplômés", body: "Toute l'équipe est diplômée d'État et formée aux dernières technologies optiques." },
                { n: "02", label: "Mutuelle Acceptée", body: "Tiers payant pour la plupart des mutuelles. Devis gratuit et transparent." },
                { n: "03", label: "Prise en Charge Rapide", body: "Résultats le jour même, lunettes en 24 h à 7 jours selon les verres." },
              ].map((p, i) => (
                <Reveal key={p.label} delay={i * 0.12} className="py-7">
                  <div className="flex items-start gap-5">
                    <span className="text-xs font-semibold tabular-nums text-white/30 mt-1">{p.n}</span>
                    <div>
                      <h3 className="font-semibold text-white">{p.label}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/55">{p.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS  (light gray)
      ══════════════════════════════════════════════════════════════ */}
      <section id="processus" className="scroll-mt-20 bg-[#f7f4ef] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: accent }}>
              Comment ça marche
            </p>
            <h2
              className="font-serif font-semibold"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", color: accent }}
            >
              Simple, rapide, sans surprise
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.14}>
                <div className="flex flex-col">
                  <span
                    className="mb-4 font-serif text-6xl font-bold leading-none tabular-nums sm:text-7xl"
                    style={{ color: `${accent}1a` }}
                  >
                    {step.n}
                  </span>
                  <div className="mb-4 h-px w-8" style={{ background: accent }} />
                  <h3 className="font-semibold" style={{ color: "#0d1a2d" }}>{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIAL  (white, editorial quote)
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <div className="mb-8 h-12 w-px" style={{ background: accent }} />
            <blockquote
              className="font-serif font-medium leading-snug"
              style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", color: "#0d1a2d" }}
            >
              &ldquo;Équipe très professionnelle et à l&apos;écoute. Mon examen a été rapide et précis, et j&apos;ai trouvé mes lunettes parfaites en 20 minutes.&rdquo;
            </blockquote>
            <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-gray-400">
              — Samira L., cliente depuis 2022
            </p>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 7 — CTA  (dark navy, full-screen feel)
      ══════════════════════════════════════════════════════════════ */}
      <section className="flex min-h-[60vh] items-center py-24 sm:py-32" style={{ background: accent }}>
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <Reveal direction="left">
              <h2
                className="font-serif font-semibold leading-tight text-white"
                style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
              >
                Prenez soin<br />de votre vision.
              </h2>
            </Reveal>
            <Reveal direction="right" delay={0.15} className="flex flex-col items-start gap-5 lg:items-end">
              <p className="max-w-xs text-sm leading-relaxed text-white/55 lg:text-right">
                Réservez votre examen de vue ou votre consultation en quelques secondes. Confirmation immédiate.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={`/b/${businessId}/services`}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-semibold shadow-xl transition"
                  style={{ color: accent }}
                >
                  Prendre rendez-vous
                  <span aria-hidden className="text-lg">→</span>
                </Link>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer id="contact" className="scroll-mt-20 border-t bg-white py-14" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            <div>
              {business.logoUrl ? (
                <img src={business.logoUrl} alt={business.name} className="h-7 w-auto object-contain" />
              ) : (
                <span className="font-bold text-lg" style={{ color: accent }}>{business.name}</span>
              )}
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Horaires</p>
              <p className="mt-2 text-sm text-gray-600">Lun – Sam · 9h – 19h</p>
              <p className="mt-1 text-sm text-gray-400">{city}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Réservation</p>
              <Link
                href={`/b/${businessId}/services`}
                className="mt-3 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-85"
                style={{ backgroundColor: accent }}
              >
                Réserver en ligne
              </Link>
            </div>
          </div>
          <p className="mt-10 border-t pt-8 text-center text-xs text-gray-400" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
            © {new Date().getFullYear()} {business.name}. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
