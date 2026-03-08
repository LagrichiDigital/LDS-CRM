"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_SECTION_HEIGHT_VH = 400;
const SECTION_IMAGES = [
  "/assets/atelier-9/atelier-9-woman-towel.png",
  "/assets/atelier-9/atelier-9-woman-towel-2.png",
];

const SERVICES = [
  {
    title: "Coiffure & Onglerie",
    description:
      "Coiffure et onglerie réalisées avec précision pour sublimer votre style au quotidien.",
    icon: (
      <svg className="h-7 w-7 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 4c-2 2-3 5-3 8 0 2 .5 4 1 5 .5 1 0 2-.5 2.5-1 .5-.5.5-1.5 0-2.5C9 14.5 8 12 8 9.5c0-2.5 1-4.5 4-5.5z" />
        <path d="M12 4c2 2 3 5 3 8 0 2-.5 4-1 5-.5 1 0 2 .5 2.5 1 .5.5.5 1.5 0 2.5C15 14.5 16 12 16 9.5c0-2.5-1-4.5-4-5.5z" />
        <path d="M12 6v12M8 10c2 1 4 1 6 0M8 14c2 1 4 1 6 0" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Boutique & Spa",
    description:
      "Une sélection de soins et produits pensés pour votre bien-être et votre beauté.",
    icon: (
      <svg className="h-7 w-7 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 4c-2 2-3 5-3 8 0 2 .5 4 1 5 .5 1 0 2-.5 2.5-1 .5-.5.5-1.5 0-2.5C9 14.5 8 12 8 9.5c0-2.5 1-4.5 4-5.5z" />
        <path d="M12 4c2 2 3 5 3 8 0 2-.5 4-1 5-.5 1 0 2 .5 2.5 1 .5.5.5 1.5 0 2.5C15 14.5 16 12 16 9.5c0-2.5-1-4.5-4-5.5z" />
        <path d="M12 6v12M8 10c2 1 4 1 6 0M8 14c2 1 4 1 6 0" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
  },
  {
    title: "Club & Spa",
    description:
      "Un espace dédié à la détente, aux soins et à une expérience beauté exclusive.",
    icon: (
      <svg className="h-7 w-7 text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 4c-2 2-3 5-3 8 0 2 .5 4 1 5 .5 1 0 2-.5 2.5-1 .5-.5.5-1.5 0-2.5C9 14.5 8 12 8 9.5c0-2.5 1-4.5 4-5.5z" />
        <path d="M12 4c2 2 3 5 3 8 0 2-.5 4-1 5-.5 1 0 2 .5 2.5 1 .5.5.5 1.5 0 2.5C15 14.5 16 12 16 9.5c0-2.5-1-4.5-4-5.5z" />
        <path d="M12 6v12M8 10c2 1 4 1 6 0M8 14c2 1 4 1 6 0" />
        <circle cx="12" cy="18" r="2" />
      </svg>
    ),
  },
];

type LocationHero = {
  image: string;
  title: string;
};

type Props = {
  locations: LocationHero[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function NosServicesPanel() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((i) => (i === SECTION_IMAGES.length - 1 ? 0 : i + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goPrev = () =>
    setSlideIndex((i) => (i === 0 ? SECTION_IMAGES.length - 1 : i - 1));
  const goNext = () =>
    setSlideIndex((i) => (i === SECTION_IMAGES.length - 1 ? 0 : i + 1));

  return (
    <div className="flex h-screen w-full min-w-0 items-center justify-center bg-[#faf9f7] px-[10%] py-6">
      <div className="mx-auto grid min-h-0 w-full max-w-[1440px] grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-10 lg:gap-12">
        <div className="relative aspect-[4/5] w-full min-h-[280px] overflow-hidden md:min-h-[360px] rounded-lg">
          {SECTION_IMAGES.map((src, index) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{
                opacity: index === slideIndex ? 1 : 0,
                pointerEvents: index === slideIndex ? "auto" : "none",
              }}
              aria-hidden={index !== slideIndex}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 1023px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ))}
          <div className="absolute bottom-4 left-4 flex gap-2 md:bottom-6 md:left-6">
            <button
              type="button"
              onClick={goPrev}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-neutral-900 shadow-md transition hover:bg-neutral-100"
              aria-label="Previous slide"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-neutral-900 shadow-md transition hover:bg-neutral-100"
              aria-label="Next slide"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center bg-[#faf9f7] px-6 py-16 md:px-10 md:py-20 lg:px-14 lg:py-24">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
            / Nos Services
          </p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-neutral-900 md:text-4xl">
            Nos Services
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 md:text-lg">
            Nous proposons une gamme complète de services beauté et bien-être, alliant savoir-faire, qualité et attention au détail pour sublimer votre apparence.
          </p>

          <div className="mt-10 flex flex-col gap-5 md:mt-12 md:gap-6">
            {SERVICES.map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-lg border border-neutral-200/70 bg-[#faf9f7] p-5 shadow-sm transition hover:border-neutral-200 hover:shadow-md md:gap-5 md:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 md:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-600 md:mt-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationPanel({ loc }: { loc: LocationHero }) {
  return (
    <div className="relative flex h-full min-h-[100vh] min-w-0 items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={loc.image}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" aria-hidden />
      <h2 className="relative z-10 text-center font-serif text-4xl font-medium uppercase tracking-[0.2em] text-white drop-shadow-lg md:text-5xl lg:text-6xl lg:tracking-[0.25em]">
        {loc.title}
      </h2>
    </div>
  );
}

export function ServicesAndLocationHeroes({ locations }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const rafRef = useRef<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const panelCount = 1 + locations.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = () => setPrefersReducedMotion(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const updateProgress = useCallback(() => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const sectionHeight = (SCROLL_SECTION_HEIGHT_VH / 100) * vh;
    const startTop = vh;
    const endTop = vh - sectionHeight;
    const progress = clamp((startTop - rect.top) / (startTop - endTop), 0, 1);

    // Reserve first 30% of scroll for Nos Services (hold on panel 0), then 70% for the 3 heroes
    const holdFraction = 0.3;
    const heroProgress =
      progress <= holdFraction ? 0 : (progress - holdFraction) / (1 - holdFraction);
    const maxTranslate = (panelCount - 1) * 100;
    setTranslateX(-clamp(heroProgress, 0, 1) * maxTranslate);
  }, [panelCount]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const onScroll = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        updateProgress();
        rafRef.current = null;
      });
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <section id="services" className="scroll-mt-20">
        <NosServicesPanel />
        {locations.map((loc) => (
          <LocationPanel key={loc.title} loc={loc} />
        ))}
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative scroll-mt-20"
      style={{ height: `${SCROLL_SECTION_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="grid h-full will-change-transform"
          style={{
            gridTemplateColumns: `repeat(${panelCount}, minmax(100vw, 100vw))`,
            width: `${panelCount * 100}vw`,
            transform: `translateX(${translateX}vw)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <NosServicesPanel />
          {locations.map((loc) => (
            <LocationPanel key={loc.title} loc={loc} />
          ))}
        </div>
      </div>
    </section>
  );
}
