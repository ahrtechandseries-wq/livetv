'use client';

import { useChannels } from '@/hooks/useChannels';
import { useFavorites } from '@/hooks/useFavorites';
import ChannelGrid from '@/components/ChannelGrid';

export default function FavoritesPage() {

  const { channels, loading } = useChannels();

  const { favorites } = useFavorites();

  const favoriteChannels = channels.filter((c) => favorites.includes(c.id));

  return (
    <div>
      <h1 className="mb-4 px-4 text-2xl font-extrabold text-nex-text">★ Favorites</h1>

      <ChannelGrid
        channels={favoriteChannels}
        loading={loading}
        emptyMessage="You haven't favorited any channels yet — tap the ☆ on a channel card to add one."
      />
    </div>
  );

}
