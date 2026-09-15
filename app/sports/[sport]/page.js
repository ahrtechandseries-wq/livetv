'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import SportsEventCard from '@/components/SportsEventCard';
import { useChannels } from '@/hooks/useChannels';
import ChannelRow from '@/components/ChannelRow';

const LABELS = {
  football: 'Football',
  cricket: 'Cricket',
  basketball: 'Basketball',
  tennis: 'Tennis',
  baseball: 'Baseball',
  hockey: 'Hockey',
  americanfootball: 'American Football',
  rugby: 'Rugby',
  volleyball: 'Volleyball'
};

export default function SportDetailPage() {

  const { sport } = useParams();

  const [state, setState] = useState({ events: [], loading: true, unavailable: false, reason: null });

  const { channels } = useChannels();

  useEffect(() => {

    let cancelled = false;

    setState((s) => ({ ...s, loading: true }));

    fetch(`/api/sports?sport=${encodeURIComponent(sport)}`)
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

  }, [sport]);

  // Link to relevant sports channels by name/category metadata
  // only - never claims a specific channel carries a specific
  // event unless the source data itself confirms it.
  const relatedChannels = channels.filter(
    (c) => c.categoryKey === 'sports' && c.name.toLowerCase().includes(sport === 'americanfootball' ? 'nfl' : sport)
  );

  return (
    <div>
      <h1 className="mb-4 px-4 text-2xl font-extrabold text-nex-text">
        {LABELS[sport] || sport}
      </h1>

      {state.loading && <p className="px-4 text-sm text-nex-muted">Loading events…</p>}

      {!state.loading && state.unavailable && (
        <p className="px-4 text-sm text-nex-muted">{state.reason}</p>
      )}

      {!state.loading && !state.unavailable && state.events.length === 0 && (
        <p className="px-4 text-sm text-nex-muted">No {LABELS[sport] || sport} events found right now.</p>
      )}

      <div className="mb-8 grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.events.map((event) => (
          <SportsEventCard key={event.id} event={event} />
        ))}
      </div>

      {relatedChannels.length > 0 && (
        <ChannelRow title={`Related ${LABELS[sport] || sport} Channels`} channels={relatedChannels} />
      )}
    </div>
  );

}
