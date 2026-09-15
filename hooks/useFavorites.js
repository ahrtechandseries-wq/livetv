'use client';

import { useCallback, useEffect, useState } from 'react';
import { getFavorites, toggleFavorite as toggleFavoriteStorage } from '@/lib/favorites';

export function useFavorites() {

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {

    setFavorites(getFavorites());

  }, []);

  const toggle = useCallback((channelId) => {

    setFavorites(toggleFavoriteStorage(channelId));

  }, []);

  return {
    favorites,
    isFavorite: (id) => favorites.includes(id),
    toggle
  };

}
