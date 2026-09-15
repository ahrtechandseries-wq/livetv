'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SportsEventCard from '@/components/SportsEventCard';

const SPORTS = [
  { key: 'football', label: 'Football' },
  { key: 'cricket', label: 'Cricket' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'tennis', label: 'Tennis' },
  { key: 'baseball', label: 'Baseball' },
  { key: 'hockey', label: 'Hockey' },
  { key: 'americanfootball', label: 'American Football' },
  { key: 'rugby', label: 'Rugby' },
  { key: 'volleyball', label: 'Volleyball' }
];

export default function SportsPage() {

  const [state, setState] = useState({ events: [], loading: true, unavailable: false, reason: null });

  useEffect(() => {

    let cancelled = false;

    fetch('/api/sports')
      .then((res) => res.json())
      .then((data) => {

        if (cancelled) return;

        setState({
          events: data.events || [],
          loading: false,
          unavailable: data.unavailable,
          reason: data.reason
        });

      })
      .catch((err) => {

        if (cancelled) return;

        setState({ events: [], loading: false, unavailable: true, reason: err.message });

      });

    return () => { cancelled = true; };

  }, []);

  return (
    <div>
      <h1 className="mb-4 px-4 text-2xl font-extrabold text-nex-text">All Sports</h1>

      <div className="mb-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none">
        {SPORTS.map((s) => (
          <Link
            key={s.key}
            href={`/sports/${s.key}`}
            className="shrink-0 rounded-full border border-nex-border bg-nex-panel px-4 py-1.5 text-sm text-nex-text
              transition-colors hover:border-nex-red/60 focus-visible:outline focus-visible:outline-2
              focus-visible:outline-nex-red"
          >
            {s.label}
          </Link>
        ))}
      </div>

      {state.loading && (
        <p className="px-4 text-sm text-nex-muted">Loading events…</p>
      )}

      {!state.loading && state.unavailable && (
        <p className="px-4 text-sm text-nex-muted">{state.reason || 'Sports data is unavailable right now.'}</p>
      )}

      {!state.loading && !state.unavailable && state.events.length === 0 && (
        <p className="px-4 text-sm text-nex-muted">No events found right now.</p>
      )}

      <div className="grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.events.map((event) => (
          <SportsEventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );

}
