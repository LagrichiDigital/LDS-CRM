import Image from "next/image";
import Link from "next/link";

import { AnimatedLocationsSection } from "@/app/b/[businessId]/landings/AnimatedLocationsSection";
import { HeroTopBar } from "@/app/b/[businessId]/landings/HeroTopBar";
import { ServicesAndLocationHeroes } from "@/app/b/[businessId]/landings/ServicesAndLocationHeroes";
import { PalmariaShell } from "@/app/b/[businessId]/landings/PalmariaShell";
import type { Business } from "@/types/appwrite.types";

const ATELIER_9_BASE = "/assets/atelier-9";

// Default (fallback) images – used when not Atelier 9 or when local file is missing
const DEFAULT_EXPLORE = [
  {
    title: "Cuts & Styling",
    fromLabel: "From 150 MAD",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=85",
  },
  {
    title: "Color & Highlights",
    fromLabel: "From 350 MAD",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&q=85",
  },
  {
    title: "Treatments",
    fromLabel: "From 200 MAD",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=85",
  },
];
const DEFAULT_AMENITY =
  "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=1200&q=85";
const DEFAULT_BLOG = [
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&q=85",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=400&q=85",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=400&q=85",
];

// Atelier 9 / Boutique Spa Souissi – images from public/assets/atelier-9/
const ATELIER_9_EXPLORE = [
  { title: "Cuts & Styling", fromLabel: "From 150 MAD", image: `${ATELIER_9_BASE}/atelier-9-reception.png` },
  { title: "Color & Highlights", fromLabel: "From 350 MAD", image: `${ATELIER_9_BASE}/atelier-9-skin-gym.png` },
  { title: "Treatments", fromLabel: "From 200 MAD", image: `${ATELIER_9_BASE}/atelier-9-chairs.png` },
];
const ATELIER_9_AMENITY = `${ATELIER_9_BASE}/atelier-9-hall.png`;
const ATELIER_9_BLOG = [
  `${ATELIER_9_BASE}/atelier-9-small-room.png`,
  `${ATELIER_9_BASE}/atelier-9-reception-2.png`,
  `${ATELIER_9_BASE}/atelier-9-wall-logo.png`,
];
const ATELIER_9_HERO = `${ATELIER_9_BASE}/atelier-9-skin-gym.png`;

type Props = {
  business: Business;
  businessId: string;
};

export function PalmariaLanding({ business, businessId }: Props) {
  const title = business.landingTitle || business.name;
  const description =
    business.landingDescription ||
    "Curated cuts, color, and care—with easy online booking and a warm welcome.";
  const currency = business.currency || "MAD";
  const isAtelier9 = business.slug === "atelier-9";
  const exploreImages = isAtelier9 ? ATELIER_9_EXPLORE : DEFAULT_EXPLORE;
  const locationImages = isAtelier9
    ? [
        {
          title: "Salon Chairs",
          image: `${ATELIER_9_BASE}/atelier-9-hay-riad.png`,
          label: "Hair & Nail Salon - Hay Riad",
          href: "#hay-riad",
        },
        {
          title: "Chairs",
          image: `${ATELIER_9_BASE}/atelier-9-chairs.png`,
          label: "Boutique & Spa - Soussi",
          href: "#soussi",
        },
        {
          title: "Club",
          image: `${ATELIER_9_BASE}/atelier-9-club.png`,
          label: "Club & Spa - Hôtel Dawliz",
          href: "#dawliz",
        },
      ]
    : exploreImages.slice(0, 3).map((item) => ({
        ...item,
        label: item.title,
        href: "#",
      }));
  const amenityImage = isAtelier9 ? ATELIER_9_AMENITY : DEFAULT_AMENITY;
  const blogImages = isAtelier9 ? ATELIER_9_BLOG : DEFAULT_BLOG;
  const brandStyle = business.primaryColor
    ? {
        backgroundColor: business.primaryColor,
        borderColor: business.primaryColor,
      }
    : undefined;

  return (
    <PalmariaShell
      businessName={business.name}
      businessId={businessId}
      logoUrl={business.logoUrl}
    >
      {/* Hero — full-bleed image, left gradient overlay, text + CTA on the left */}
      <section className="relative flex min-h-[100vh] items-center overflow-hidden bg-neutral-800">
        {isAtelier9 && (
          <Image
            src={ATELIER_9_HERO}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="object-cover object-center"
            style={{ zIndex: 0 }}
          />
        )}
        {/* Dark linear gradient overlay for readability (matches reference hero) */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.35) 70%, transparent 90%)",
          }}
          aria-hidden
        />
        <HeroTopBar
          businessId={businessId}
          businessName={business.name}
          logoUrl={business.logoUrl}
        />
        <div className="relative z-10 w-full max-w-5xl px-[10%] py-24">
          {isAtelier9 ? (
            <>
              <p className="text-sm font-medium uppercase tracking-widest text-white md:text-base">
                TROIS ADRESSES · UNE SIGNATURE
              </p>
              <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-white md:text-5xl lg:text-6xl">
                Une Évasion Intime
                <br />
                Vers Le Soin & Le Luxe
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/95 md:text-lg">
                Atelier 9 incarne une approche moderne de la beauté et du bien-être, où expertise, élégance et confort se rencontrent. À travers ses espaces Hair & Nail, Boutique & Spa et Club & Spa, chaque expérience est pensée pour offrir soin, détente et luxe raffiné.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="#services"
                  className="inline-flex items-center gap-2 rounded-full border border-white bg-transparent px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-neutral-900"
                >
                  Nos expériences
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="#explore"
                  className="inline-flex items-center gap-2 rounded-full border border-white bg-transparent px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white hover:text-neutral-900"
                >
                  Nos lieux
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold uppercase tracking-[0.2em] text-white md:text-5xl lg:text-6xl lg:tracking-[0.25em]">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg text-white md:text-xl">
                {description}
              </p>
              <Link
                href="#explore"
                className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-base font-semibold text-neutral-900 shadow-lg transition hover:bg-neutral-100"
              >
                Explore our locations
              </Link>
            </>
          )}
        </div>
      </section>

      <ServicesAndLocationHeroes
        locations={locationImages.map((loc) => ({
          image: loc.image,
          title: loc.label,
        }))}
      />

      <AnimatedLocationsSection locationImages={locationImages} />

      <section
        id="experience"
        className="scroll-mt-20 border-t border-neutral-200 bg-white py-20 md:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Salon Experience
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-neutral-800">
            A welcoming space with natural light, premium products, and care that
            leaves you looking and feeling your best.
          </p>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">
                Relaxing Space
              </h3>
              <p className="mt-2 text-neutral-600">
                Comfortable seating and a calm atmosphere so you can unwind.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">
                Precision & Style
              </h3>
              <p className="mt-2 text-neutral-600">
                Cuts and color tailored to you, with attention to detail.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">
                Premium Products
              </h3>
              <p className="mt-2 text-neutral-600">
                Quality products for lasting results and healthy hair.
              </p>
            </div>
          </div>
          <div className="mt-16 overflow-hidden rounded-2xl border border-neutral-200">
            <img
              src={amenityImage}
              alt="Salon interior"
              className="h-[320px] w-full object-cover md:h-[400px]"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#faf9f7] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <h2 className="text-2xl font-bold text-neutral-900 md:text-3xl">
            Crafted with Purpose
          </h2>
          <p className="mt-4 text-neutral-600">
            We believe in great service, honest pricing, and making every visit
            something to look forward to.
          </p>
        </div>
      </section>

      <section className="border-t border-neutral-200 bg-[#faf9f7] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Tips & Inspiration
          </h2>
          <p className="mt-2 text-2xl font-bold text-neutral-900 md:text-3xl">
            Look good, feel good
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "How to Care for Your Hair Between Visits",
                excerpt:
                  "Simple tips to keep your style looking fresh and your hair healthy.",
                date: "Tips",
                image: blogImages[0],
              },
              {
                title: "Choosing the Right Cut for Your Face Shape",
                excerpt:
                  "Find the cut that flatters you and fits your lifestyle.",
                date: "Style",
                image: blogImages[1],
              },
              {
                title: "Why Regular Trims Matter",
                excerpt:
                  "Keeping split ends at bay and maintaining your style.",
                date: "Care",
                image: blogImages[2],
              },
            ].map((post) => (
              <article
                key={post.title}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-white transition hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-neutral-500">
                    {post.date}
                  </p>
                  <h3 className="mt-2 font-semibold text-neutral-900">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-center">
            <span className="text-sm font-semibold text-neutral-600">
              See more tips
            </span>
          </p>
        </div>
      </section>

      <footer
        id="contact"
        className="scroll-mt-20 border-t border-neutral-200 bg-neutral-900 py-20 text-white md:py-28"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Find Your Perfect Visit
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-neutral-300">
            Book your cut, color, or treatment in a few clicks. We&apos;ll see
            you soon.
          </p>
          <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-8">
            <Link
              href={`/b/${businessId}/services`}
              className="inline-flex rounded-full px-8 py-4 text-base font-semibold text-white transition hover:opacity-90"
              style={brandStyle ?? { backgroundColor: "#24ae7c" }}
            >
              Book now
            </Link>
          </div>
          <div className="mt-20 grid gap-10 border-t border-neutral-700 pt-12 md:grid-cols-3 md:gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
                Get in touch
              </p>
              <p className="mt-2 text-neutral-300">—</p>
              <p className="mt-1 text-neutral-400">
                Phone / Email / Address
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="h-7 w-auto object-contain opacity-90"
                />
              ) : (
                <span className="text-lg font-semibold text-white">
                  {business.name}
                </span>
              )}
              <p className="text-sm text-neutral-500">
                © {new Date().getFullYear()} {business.name}. All rights
                reserved.
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500">
                Privacy Policy · Terms of Service
              </p>
            </div>
          </div>
        </div>
      </footer>
    </PalmariaShell>
  );
}
