'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ChannelCard({ channel, isFavorite, onToggleFavorite }) {

  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <Link
      href={`/watch/${channel.id}`}
      tabIndex={0}
      className="group relative flex w-40 shrink-0 flex-col overflow-hidden rounded-lg
        border border-nex-border bg-nex-panel transition-transform duration-200
        hover:-translate-y-1 hover:border-nex-red/60 focus-visible:-translate-y-1
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red"
    >
      <div className="relative flex h-24 items-center justify-center bg-nex-panel2 p-3">
        {channel.logo && !logoFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.logo}
            alt={channel.name}
            className="max-h-full max-w-full object-contain"
            loading="lazy"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="text-center text-xs font-semibold text-nex-muted">
            {channel.name}
          </span>
        )}

        <span className="absolute left-2 top-2 flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-nex-red">
          <span className="h-1.5 w-1.5 animate-nex-glow rounded-full bg-nex-red" />
          Live
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.(channel.id);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-sm
            opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <div className="p-2.5">
        <p className="truncate text-sm font-semibold text-nex-text">
          {channel.name}
        </p>
        <p className="truncate text-xs text-nex-muted">
          {channel.countryLabel} · {channel.categoryLabel}
        </p>
      </div>
    </Link>
  );

}
