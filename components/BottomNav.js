'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const PRIMARY_ITEMS = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/live-tv', label: 'Live TV', icon: LiveIcon },
  { href: '/sports', label: 'Sports', icon: SportsIcon },
  { href: '/search', label: 'Search', icon: SearchIcon }
];

const MORE_ITEMS = [
  { href: '/news', label: 'News' },
  { href: '/bangladesh', label: 'Bangladesh' },
  { href: '/india', label: 'India' },
  { href: '/international', label: 'International' },
  { href: '/kids', label: 'Cartoon/Kids' },
  { href: '/favorites', label: 'Favorites' },
  { href: '/recently-watched', label: 'Recently Watched' },
  { href: '/settings', label: 'Settings' }
];

function HomeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
    </svg>
  );
}

function LiveIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 18v3" />
    </svg>
  );
}

function SportsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 21h8M12 17v4M6 4h12v3a6 6 0 01-12 0V4z" />
      <path d="M6 6H4a2 2 0 002 4M18 6h2a2 2 0 01-2 4" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function MoreIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

export default function BottomNav() {

  const pathname = usePathname();

  const router = useRouter();

  const [moreOpen, setMoreOpen] = useState(false);

  const moreActive = MORE_ITEMS.some((item) => item.href === pathname);

  return (
    <>
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setMoreOpen(false)}
        >
          <div
            className="absolute inset-x-0 bottom-16 mx-3 rounded-xl border border-nex-border bg-nex-panel p-2 animate-nex-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            {MORE_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => {
                  setMoreOpen(false);
                  router.push(item.href);
                }}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-nex-text
                  hover:bg-nex-panel2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-nex-border bg-nex-bg/95 backdrop-blur"
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex max-w-7xl items-stretch justify-between px-2">
          {PRIMARY_ITEMS.map((item) => {

            const active = pathname === item.href;

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red
                  ${active ? 'text-nex-red' : 'text-nex-muted'}`}
              >
                <Icon width={22} height={22} />
                {item.label}
              </Link>
            );

          })}

          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-label="More"
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red
              ${moreActive || moreOpen ? 'text-nex-red' : 'text-nex-muted'}`}
          >
            <MoreIcon width={22} height={22} />
            More
          </button>
        </div>
      </nav>
    </>
  );

}
