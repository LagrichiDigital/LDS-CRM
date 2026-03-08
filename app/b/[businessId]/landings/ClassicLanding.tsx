import Link from "next/link";

import type { Business } from "@/types/appwrite.types";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80";
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80",
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&q=80",
  "https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=600&q=80",
];
const SERVICE_IMAGES = [
  {
    title: "Cuts & Styling",
    description:
      "Precision cuts and styling that suit your look and lifestyle.",
    image:
      "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80",
  },
  {
    title: "Color & Highlights",
    description:
      "Full color, balayage, and highlights by our color specialists.",
    image:
      "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500&q=80",
  },
  {
    title: "Treatments",
    description:
      "Deep conditioning and treatments for healthy, shiny hair.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80",
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Pick your service",
    detail: "Choose from cuts, color, styling, and treatments.",
  },
  {
    step: 2,
    title: "Choose your time",
    detail: "Book in seconds. We'll confirm by SMS—no account needed.",
  },
  {
    step: 3,
    title: "Come in & enjoy",
    detail: "Relax in our chair. Leave looking and feeling great.",
  },
];

type Props = {
  business: Business;
  businessId: string;
};

export function ClassicLanding({ business, businessId }: Props) {
  const title = business.landingTitle || business.name;
  const description =
    business.landingDescription ||
    "Book your cut, color, or style online. Quick, easy, and hassle-free.";
  const brandStyle = business.primaryColor
    ? {
        backgroundColor: business.primaryColor,
        borderColor: business.primaryColor,
      }
    : undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#0f0f0f]">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0f0f0f]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-[5%] py-4">
          {business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="h-9 w-auto max-w-[180px] object-contain"
            />
          ) : (
            <span className="text-18-bold tracking-tight text-white">
              {business.name}
            </span>
          )}
          <Link
            href={`/b/${businessId}/services`}
            className="rounded-full px-5 py-2.5 text-14-semibold text-white transition hover:opacity-90"
            style={brandStyle ?? { backgroundColor: "#24ae7c" }}
          >
            Book now
          </Link>
        </div>
      </header>

      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-3xl px-[5%] py-32 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 text-lg text-white/90 md:text-xl">{description}</p>
          <Link
            href={`/b/${businessId}/services`}
            className="mt-10 inline-flex rounded-full px-8 py-4 text-16-semibold text-white shadow-xl transition hover:opacity-95"
            style={brandStyle ?? { backgroundColor: "#24ae7c" }}
          >
            Book your appointment
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#141414] py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-[5%]">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
            What we do
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-dark-600">
            From classic cuts to bold color, we're here to bring your look to
            life.
          </p>
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {SERVICE_IMAGES.map((s) => (
              <li
                key={s.title}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] transition hover:border-white/20"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-18-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-14-regular text-dark-600">
                    {s.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10">
        <div className="grid grid-cols-3">
          {GALLERY_IMAGES.map((src, i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden">
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#141414] py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-[5%]">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
            How it works
          </h2>
          <ol className="mt-14 flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
            {HOW_IT_WORKS.map((item) => (
              <li
                key={item.step}
                className="flex flex-1 flex-col items-center text-center sm:max-w-[220px]"
              >
                <span
                  className="mb-4 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-20-bold text-white"
                  style={
                    business.primaryColor
                      ? {
                          borderColor: business.primaryColor,
                          color: business.primaryColor,
                        }
                      : {
                          borderColor: "#24ae7c",
                          color: "#24ae7c",
                        }
                  }
                >
                  {item.step}
                </span>
                <h3 className="text-16-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-14-regular text-dark-600">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-white/10 py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-[5%] text-center">
          <p className="text-18-bold text-white md:text-2xl">
            &ldquo;Best salon experience I&apos;ve had. The team really listened
            to what I wanted and delivered.&rdquo;
          </p>
          <p className="mt-4 text-14-regular text-dark-600">
            — Sarah M., regular client
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#1a1a1a] py-20 md:py-28">
        <div className="mx-auto max-w-2xl px-[5%] text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready for your visit?
          </h2>
          <p className="mt-4 text-dark-600">
            Book your cut, color, or style in a few clicks. We&apos;ll see you
            soon.
          </p>
          <Link
            href={`/b/${businessId}/services`}
            className="mt-8 inline-flex rounded-full px-8 py-4 text-16-semibold text-white transition hover:opacity-95"
            style={brandStyle ?? { backgroundColor: "#24ae7c" }}
          >
            Book now
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#0f0f0f] py-12">
        <div className="mx-auto max-w-6xl px-[5%]">
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              {business.logoUrl ? (
                <img
                  src={business.logoUrl}
                  alt={business.name}
                  className="mx-auto h-8 w-auto object-contain md:mx-0"
                />
              ) : (
                <span className="text-16-semibold text-white">
                  {business.name}
                </span>
              )}
            </div>
            <div className="text-14-regular text-dark-600">
              <p>123 High Street • Your City</p>
              <p className="mt-1">Mon – Sat 9am – 7pm</p>
            </div>
          </div>
          <p className="mt-8 text-center text-12-regular text-dark-600">
            © {new Date().getFullYear()} {business.name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
