'use client';

import ChannelCard from './ChannelCard';
import { useFavorites } from '@/hooks/useFavorites';

export default function ChannelGrid({ channels, loading, emptyMessage }) {

  const { isFavorite, toggle } = useFavorites();

  if (loading) {

    return (
      <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-lg border border-nex-border bg-nex-panel"
          />
        ))}
      </div>
    );

  }

  if (!channels || channels.length === 0) {

    return (
      <p className="px-4 py-10 text-center text-sm text-nex-muted">
        {emptyMessage || 'No channels found here yet.'}
      </p>
    );

  }

  return (
    <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {channels.map((channel) => (
        <ChannelCard
          key={channel.id}
          channel={channel}
          isFavorite={isFavorite(channel.id)}
          onToggleFavorite={toggle}
        />
      ))}
    </div>
  );

}
