/**
 * Ranks/groups the merged channel catalogue for Home according
 * to the requested priority order:
 *   Bangladesh -> India -> Sports -> News -> Cartoon/Kids -> International
 *
 * This only ORDERS channels that already came back from real
 * sources - it never fabricates availability. "Working" here
 * means "present in the merged, deduped catalogue"; actual
 * live playability is only known once the player attempts to
 * play it (see components/Player.js failure handling), so nothing
 * client-side claims to pre-verify every stream on every page
 * load - that would mean opening a connection to every single
 * stream just to build the homepage, which does not scale.
 */

export function buildHomeSections(channels, favorites = [], recents = []) {

  const bd = channels.filter((c) => c.countryCode === 'BD');

  const india = channels.filter((c) => c.countryCode === 'IN');

  const sports = channels.filter((c) => c.categoryKey === 'sports');

  const news = channels.filter((c) => c.categoryKey === 'news');

  const kids = channels.filter((c) => c.categoryKey === 'kids');

  const usedIds = new Set(
    [...bd, ...india, ...sports, ...news, ...kids].map((c) => c.id)
  );

  const international = channels.filter((c) => !usedIds.has(c.id));

  const favoriteSet = new Set(favorites);

  const favoriteChannels = channels.filter((c) => favoriteSet.has(c.id));

  const recentChannels = recents
    .map((id) => channels.find((c) => c.id === id))
    .filter(Boolean);

  return {
    bd,
    india,
    sports,
    news,
    kids,
    international,
    favoriteChannels,
    recentChannels
  };

}

/**
 * Featured slider: prioritizes BD/India/Sports, only from
 * channels that actually have a logo AND a name - a channel
 * with no artwork makes for a broken-looking hero slide, so
 * it's skipped in the SLIDER specifically (it still appears
 * normally in its category grid elsewhere).
 */

export function buildFeaturedSlides(channels, limit = 10) {

  const priorityOrder = { BD: 0, IN: 1 };

  const withArt = channels.filter((c) => c.logo && c.name);

  const scored = withArt
    .map((c) => {

      let score = 5;

      if (c.countryCode in priorityOrder) score = priorityOrder[c.countryCode];

      if (c.categoryKey === 'sports') score = Math.min(score, 2);

      return { channel: c, score };

    })
    .sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map((s) => s.channel);

}
