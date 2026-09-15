'use client';

import { useChannels } from '@/hooks/useChannels';
import ChannelGrid from './ChannelGrid';

export default function CategoryPage({ title, filter, emptyMessage }) {

  const { channels, loading, error } = useChannels();

  const filtered = filter ? channels.filter(filter) : channels;

  return (
    <div>
      <h1 className="mb-4 px-4 text-2xl font-extrabold text-nex-text">{title}</h1>

      {error ? (
        <p className="px-4 text-sm text-nex-muted">{error}</p>
      ) : (
        <ChannelGrid channels={filtered} loading={loading} emptyMessage={emptyMessage} />
      )}
    </div>
  );

}
