'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function FeaturedSlider({ channels }) {

  const [index, setIndex] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {

    if (!channels || channels.length <= 1) return;

    timerRef.current = setInterval(() => {

      setIndex((i) => (i + 1) % channels.length);

    }, 5000);

    return () => clearInterval(timerRef.current);

  }, [channels]);

  if (!channels || channels.length === 0) return null;

  const current = channels[index];

  return (
    <section className="relative mx-4 mb-8 h-56 overflow-hidden rounded-xl border border-nex-border bg-nex-panel sm:h-72">
      <div className="absolute inset-0 bg-gradient-to-t from-nex-bg via-nex-bg/40 to-transparent z-10" />

      {current.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={current.logo}
          alt={current.name}
          className="absolute inset-0 h-full w-full object-contain p-10 opacity-70"
        />
      ) : null}

      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 p-5">
        <span className="w-fit rounded bg-nex-red px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Featured · Live
        </span>

        <h2 className="text-2xl font-extrabold text-nex-text">{current.name}</h2>

        <p className="text-sm text-nex-muted">
          {current.countryLabel} · {current.categoryLabel}
        </p>

        <Link
          href={`/watch/${current.id}`}
          className="mt-2 w-fit rounded-md bg-nex-red px-5 py-2 text-sm font-bold text-white
            transition-colors hover:bg-nex-red2 focus-visible:outline focus-visible:outline-2
            focus-visible:outline-white"
        >
          ▶ Watch Now
        </Link>
      </div>

      <div className="absolute right-4 top-4 z-20 flex gap-1.5">
        {channels.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 w-5 rounded-full transition-colors ${
              i === index ? 'bg-nex-red' : 'bg-white/25'
            }`}
          />
        ))}
      </div>
    </section>
  );

}
