'use client';

import { clearRecents } from '@/lib/recents';
import { useState } from 'react';
import Logo from '@/components/Logo';

export default function SettingsPage() {

  const [cleared, setCleared] = useState(false);

  function handleClearRecents() {

    clearRecents();

    setCleared(true);

    setTimeout(() => setCleared(false), 2000);

  }

  return (
    <div className="px-4">
      <h1 className="mb-6 text-2xl font-extrabold text-nex-text">Settings</h1>

      <section className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-nex-border bg-nex-panel p-6 text-center">
        <Logo size={40} />
        <p className="text-sm text-nex-muted">
          Live TV, Sports &amp; more — streamed straight from public sources.
        </p>
      </section>

      <section className="mb-6 rounded-xl border border-nex-border bg-nex-panel p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-nex-muted">
          Developer
        </h2>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-nex-text">Developed by</span>
          <span className="text-sm font-bold text-nex-red">AHR</span>
        </div>

        <a
          href="https://t.me/ahr2215"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block rounded-lg bg-nex-red px-4 py-3 text-center text-sm font-bold text-white
            transition-colors hover:bg-nex-red2"
        >
          Contact AHR
        </a>

        <a
          href="https://t.me/rnexflix"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block rounded-lg border border-nex-border px-4 py-3 text-center text-sm font-bold text-nex-text
            transition-colors hover:bg-nex-panel2"
        >
          Join NexLive Community
        </a>
      </section>

      <section className="mb-6 rounded-xl border border-nex-border bg-nex-panel p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-nex-muted">
          Data
        </h2>

        <button
          type="button"
          onClick={handleClearRecents}
          className="w-full rounded-lg border border-nex-border px-4 py-3 text-left text-sm font-medium text-nex-text
            hover:bg-nex-panel2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-nex-red"
        >
          {cleared ? 'Recently watched cleared ✓' : 'Clear Recently Watched'}
        </button>

        <p className="mt-2 text-xs text-nex-muted">
          Favorites and recently watched are stored only on this device — clearing
          browser data will also remove them. No account/login is used.
        </p>
      </section>

      <section className="rounded-xl border border-nex-border bg-nex-panel p-5">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-nex-muted">
          About
        </h2>

        <p className="text-sm text-nex-muted">
          NexLive aggregates publicly accessible live TV playlists and sports data.
          Streams are played directly from their original source — NexLive does not
          host, proxy, or modify any video.
        </p>
      </section>
    </div>
  );

}
