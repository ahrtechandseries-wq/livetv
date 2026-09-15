'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChannels } from '@/hooks/useChannels';
import { useFavorites } from '@/hooks/useFavorites';
import { pushRecent } from '@/lib/recents';
import Player from '@/components/Player';
import ChannelRow from '@/components/ChannelRow';

export default function WatchPage() {

  const { id } = useParams();

  const router = useRouter();

  const { channels, loading } = useChannels();

  const { isFavorite, toggle } = useFavorites();

  const channel = useMemo(
    () => channels.find((c) => c.id === id),
    [channels, id]
  );

  const related = useMemo(() => {

    if (!channel) return [];

    return channels
      .filter(
        (c) =>
          c.id !== channel.id &&
          (c.categoryKey === channel.categoryKey || c.countryCode === channel.countryCode)
      )
      .slice(0, 20);

  }, [channels, channel]);

  useEffect(() => {

    if (channel) pushRecent(channel.id);

  }, [channel]);

  function goToNextChannel() {

    if (related.length === 0) return;

    router.push(`/watch/${related[0].id}`);

  }

  if (loading) {

    return <div className="px-4 py-16 text-center text-nex-muted">Loading…</div>;

  }

  if (!channel) {

    return (
      <div className="px-4 py-16 text-center">
        <p className="font-semibold text-nex-text">Channel not found.</p>
        <p className="mt-1 text-sm text-nex-muted">
          It may have been removed from the source playlists since your last visit.
        </p>
      </div>
    );

  }

  return (
    <div>
      <div className="px-4">
        <Player src={channel.url} onExhausted={goToNextChannel} />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-3">
          {channel.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={channel.logo} alt={channel.name} className="h-12 w-12 rounded object-contain" />
          ) : null}

          <div>
            <h1 className="text-xl font-extrabold text-nex-text">{channel.name}</h1>
            <p className="text-sm text-nex-muted">
              {channel.countryLabel} · {channel.categoryLabel}
              {channel.language ? ` · ${channel.language}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggle(channel.id)}
          className="rounded-md border border-nex-border px-4 py-2 text-sm font-semibold text-nex-text
            transition-colors hover:border-nex-red/60 focus-visible:outline focus-visible:outline-2
            focus-visible:outline-nex-red"
        >
          {isFavorite(channel.id) ? '★ Favorited' : '☆ Add to Favorites'}
        </button>
      </div>

      <ChannelRow title="Related Channels" channels={related} />
    </div>
  );

}
