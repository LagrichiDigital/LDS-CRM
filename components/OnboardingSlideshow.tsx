"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 5000;

type OnboardingSlideshowProps = {
  images: { src: string; alt: string }[];
  className?: string;
};

export function OnboardingSlideshow({
  images,
  className = "",
}: OnboardingSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: i === index ? 1 : 0,
            zIndex: i === index ? 1 : 0,
          }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="50vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}
    </div>
  );
}
