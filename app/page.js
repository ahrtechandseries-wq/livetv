'use client';

import { useChannels } from '@/hooks/useChannels';
import { useFavorites } from '@/hooks/useFavorites';
import { getRecents } from '@/lib/recents';
import { buildHomeSections, buildFeaturedSlides } from '@/lib/ranking';
import FeaturedSlider from '@/components/FeaturedSlider';
import ChannelRow from '@/components/ChannelRow';
import CommunityLinks from '@/components/CommunityLinks';
import { useEffect, useState } from 'react';

export default function HomePage() {

  const { channels, loading, error, sourceStatus } = useChannels();

  const { favorites } = useFavorites();

  const [recents, setRecents] = useState([]);

  useEffect(() => {

    setRecents(getRecents());

  }, [channels]);

  if (loading) {

    return (
      <div className="px-4 py-16 text-center text-nex-muted">
        Loading live channels…
      </div>
    );

  }

  if (error) {

    return (
      <div className="mx-4 rounded-lg border border-nex-red/40 bg-nex-panel p-6 text-center">
        <p className="font-semibold text-nex-text">Couldn&apos;t load the channel catalogue.</p>
        <p className="mt-1 text-sm text-nex-muted">{error}</p>
      </div>
    );

  }

  const sections = buildHomeSections(channels, favorites, recents);

  const featured = buildFeaturedSlides(channels);

  const downSources = sourceStatus.filter((s) => !s.ok);

  return (
    <div>
      <FeaturedSlider channels={featured} />

      {downSources.length > 0 && (
        <div className="mx-4 mb-6 rounded-md border border-nex-red/30 bg-nex-panel px-4 py-2 text-xs text-nex-muted">
          {downSources.length} of {sourceStatus.length} playlist sources are unreachable right now — showing channels from the rest.
        </div>
      )}

      <ChannelRow title="Continue Watching" channels={sections.recentChannels} />
      <ChannelRow title="🇧🇩 Bangladesh" channels={sections.bd} emptyMessage="No Bangladesh channels found in the current sources." />
      <ChannelRow title="🇮🇳 India" channels={sections.india} emptyMessage="No India channels found in the current sources." />
      <ChannelRow title="⚽ Sports" channels={sections.sports} emptyMessage="No sports channels found in the current sources." />
      <ChannelRow title="📰 News" channels={sections.news} />
      <ChannelRow title="🧸 Cartoon/Kids" channels={sections.kids} />
      <ChannelRow title="🌍 International" channels={sections.international.slice(0, 24)} />
      <ChannelRow title="★ Favorites" channels={sections.favoriteChannels} />

      <CommunityLinks />
    </div>
  );

}
