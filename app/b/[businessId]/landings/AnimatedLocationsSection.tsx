"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type LocationItem = {
  title: string;
  image: string;
  label: string;
  href: string;
};

type Props = {
  locationImages: LocationItem[];
};

export function AnimatedLocationsSection({ locationImages }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true);
        });
      },
      { rootMargin: "0px 0px -80px 0px", threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="scroll-mt-20 bg-neutral-100 py-20 md:py-32"
    >
      <div className="mx-auto max-w-[1440px] px-5 md:px-8">
        <h2 className="text-left text-3xl font-bold text-neutral-900 md:text-4xl">
          Explore our Locations
        </h2>
        <div
          className="mt-12 md:mt-16"
          style={{
            transform: inView ? "scale(1)" : "scale(1.05)",
            transformOrigin: "center center",
            transition: "transform 1s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <div
            className="grid grid-cols-3"
            style={{
              gap: inView ? "1.5rem" : 0,
              transition: "gap 1s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
          {locationImages.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group block overflow-hidden bg-white"
            >
              <div className="relative aspect-[3/5] w-full min-h-[320px] overflow-hidden md:min-h-[420px]">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-white/95 px-4 py-3.5 opacity-0 shadow-[0_-2px_12px_rgba(0,0,0,0.08)] transition-opacity duration-300 ease-out group-hover:opacity-100">
                  <span className="text-sm font-semibold text-neutral-900 md:text-base">
                    {item.label}
                  </span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-800 transition group-hover:bg-neutral-300">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
