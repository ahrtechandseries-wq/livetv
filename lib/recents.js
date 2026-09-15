const KEY = 'nexlive:recents';

const MAX_RECENTS = 20;

export function getRecents() {

  if (typeof window === 'undefined') return [];

  try {

    const raw = window.localStorage.getItem(KEY);

    return raw ? JSON.parse(raw) : [];

  }

  catch (e) {

    return [];

  }

}

export function pushRecent(channelId) {

  const current = getRecents().filter((id) => id !== channelId);

  const next = [channelId, ...current].slice(0, MAX_RECENTS);

  window.localStorage.setItem(KEY, JSON.stringify(next));

  return next;

}

export function clearRecents() {

  window.localStorage.setItem(KEY, JSON.stringify([]));

}
