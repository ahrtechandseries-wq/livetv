'use client';

import ChannelCard from './ChannelCard';
import { useFavorites } from '@/hooks/useFavorites';

export default function ChannelRow({ title, channels, emptyMessage }) {

  const { isFavorite, toggle } = useFavorites();

  if (!channels || channels.length === 0) {

    return emptyMessage ? (
      <section className="mb-8 px-4">
        <h2 className="mb-3 text-lg font-bold text-nex-text">{title}</h2>
        <p className="text-sm text-nex-muted">{emptyMessage}</p>
      </section>
    ) : null;

  }

  return (
    <section className="mb-8">
      <h2 className="mb-3 px-4 text-lg font-bold text-nex-text">{title}</h2>

      <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
        {channels.map((channel) => (
          <ChannelCard
            key={channel.id}
            channel={channel}
            isFavorite={isFavorite(channel.id)}
            onToggleFavorite={toggle}
          />
        ))}
      </div>
    </section>
  );

}
