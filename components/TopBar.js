'use client';

import Link from 'next/link';
import Logo from './Logo';

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export default function TopBar() {

  return (
    <header className="sticky top-0 z-40 border-b border-nex-border bg-nex-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/">
          <Logo size={26} />
        </Link>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search channels"
            className="rounded-full p-2 text-nex-text hover:bg-nex-panel2
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red"
          >
            <SearchIcon width={20} height={20} />
          </Link>

          <Link
            href="/settings"
            aria-label="Settings"
            className="rounded-full p-2 text-nex-text hover:bg-nex-panel2
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red"
          >
            <SettingsIcon width={20} height={20} />
          </Link>
        </div>
      </div>
    </header>
  );

}
