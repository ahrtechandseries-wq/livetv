'use client';

import { useEffect, useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { getRecents, clearRecents } from '@/lib/recents';
import ChannelGrid from '@/components/ChannelGrid';

export default function RecentlyWatchedPage() {

  const { channels, loading } = useChannels();

  const [recentIds, setRecentIds] = useState([]);

  useEffect(() => {

    setRecentIds(getRecents());

  }, []);

  const recentChannels = recentIds
    .map((id) => channels.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between px-4">
        <h1 className="text-2xl font-extrabold text-nex-text">Recently Watched</h1>

        {recentChannels.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearRecents();
              setRecentIds([]);
            }}
            className="text-xs font-semibold text-nex-red hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <ChannelGrid
        channels={recentChannels}
        loading={loading}
        emptyMessage="Nothing watched yet — channels you open will show up here automatically."
      />
    </div>
  );

}
