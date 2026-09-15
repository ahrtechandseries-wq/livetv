const KEY = 'nexlive:favorites';

export function getFavorites() {

  if (typeof window === 'undefined') return [];

  try {

    const raw = window.localStorage.getItem(KEY);

    return raw ? JSON.parse(raw) : [];

  }

  catch (e) {

    return [];

  }

}

export function isFavorite(channelId) {

  return getFavorites().includes(channelId);

}

export function toggleFavorite(channelId) {

  const current = getFavorites();

  const next = current.includes(channelId)
    ? current.filter((id) => id !== channelId)
    : [...current, channelId];

  window.localStorage.setItem(KEY, JSON.stringify(next));

  return next;

}
