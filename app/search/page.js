'use client';

import { useMemo, useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import ChannelGrid from '@/components/ChannelGrid';

export default function SearchPage() {

  const { channels, loading } = useChannels();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {

    const q = query.trim().toLowerCase();

    if (!q) return [];

    return channels.filter((c) => {

      const haystack = [
        c.name,
        c.countryLabel,
        c.categoryLabel,
        c.language
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);

    });

  }, [channels, query]);

  return (
    <div>
      <div className="mb-6 px-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search channel, country, category, language…"
          autoFocus
          className="w-full rounded-lg border border-nex-border bg-nex-panel px-4 py-3 text-sm
            text-nex-text placeholder:text-nex-muted focus-visible:outline focus-visible:outline-2
            focus-visible:outline-nex-red"
        />
      </div>

      {query.trim() ? (
        <ChannelGrid
          channels={results}
          loading={loading}
          emptyMessage={`No channels matched "${query}".`}
        />
      ) : (
        <p className="px-4 text-sm text-nex-muted">Start typing to search channels.</p>
      )}
    </div>
  );

}
