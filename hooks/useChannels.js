'use client';

import { useEffect, useState } from 'react';

let memoryCache = null;

/**
 * Fetches the merged catalogue from /api/channels once per
 * browser session (module-level memoryCache), so navigating
 * between Home / Live TV / Sports / etc doesn't re-fetch and
 * re-render-thrash on every route change. The API route itself
 * is also server-cached (see app/api/channels/route.js), so
 * this is a second, cheaper layer on top of that.
 */
export function useChannels() {

  const [state, setState] = useState({
    channels: memoryCache?.channels || [],
    loading: !memoryCache,
    error: null,
    sourceStatus: memoryCache?.sourceStatus || []
  });

  useEffect(() => {

    if (memoryCache) return;

    let cancelled = false;

    fetch('/api/channels')
      .then((res) => res.json())
      .then((data) => {

        if (cancelled) return;

        if (data.error) {

          setState({ channels: [], loading: false, error: data.error, sourceStatus: [] });

          return;

        }

        memoryCache = data;

        setState({
          channels: data.channels,
          loading: false,
          error: null,
          sourceStatus: data.sourceStatus
        });

      })
      .catch((err) => {

        if (cancelled) return;

        setState({
          channels: [],
          loading: false,
          error: err.message,
          sourceStatus: []
        });

      });

    return () => {
      cancelled = true;
    };

  }, []);

  return state;

}
