import { parseM3U } from './m3u';
import { dedupeChannels } from './dedupe';
import { detectCountry, detectCategory } from './categorize';
import { PLAYLIST_SOURCES } from './sources';

/**
 * Simple stable hash for building a channel id from its
 * normalized stream URL - used so the same channel keeps the
 * same id across requests without needing a database.
 */
function hashId(str) {

  let hash = 0;

  for (let i = 0; i < str.length; i++) {

    hash = (hash << 5) - hash + str.charCodeAt(i);

    hash |= 0;

  }

  return Math.abs(hash).toString(36);

}

async function fetchSource(source) {

  try {

    const res = await fetch(source.url, {
      // This is playlist TEXT, not a video stream - fetching
      // it server-side is aggregation/caching, not a stream
      // proxy. Actual video playback later goes browser ->
      // stream host directly (see components/Player.js).
      headers: { 'User-Agent': 'NexLive/1.0 (+playlist-aggregator)' },
      signal: AbortSignal.timeout(15000)
    });

    if (!res.ok) {

      console.log(`NexLive: source "${source.name}" returned ${res.status}`);

      return { source, text: null, error: `HTTP ${res.status}` };

    }

    const text = await res.text();

    return { source, text, error: null };

  }

  catch (err) {

    console.log(`NexLive: source "${source.name}" failed:`, err.message);

    return { source, text: null, error: err.message };

  }

}

/**
 * Fetches every configured source in parallel, parses,
 * normalizes, categorizes and dedupes into one catalogue.
 * A source that's down/unreachable is skipped (its error is
 * reported back) rather than failing the whole catalogue -
 * losing one source shouldn't take down every other channel.
 */
export async function buildCatalogue() {

  const results = await Promise.all(
    PLAYLIST_SOURCES.map(fetchSource)
  );

  const sourceStatus = results.map((r) => ({
    name: r.source.name,
    ok: !!r.text,
    error: r.error
  }));

  let allChannels = [];

  for (const result of results) {

    if (!result.text) continue;

    const parsed = parseM3U(result.text, result.source.name);

    allChannels = allChannels.concat(parsed);

  }

  const deduped = dedupeChannels(allChannels);

  const enriched = deduped
    .filter((c) => c.url && c.name)
    .map((c) => {

      const country = detectCountry(c);

      const category = detectCategory(c);

      return {
        id: hashId(c.url.toLowerCase().trim() + '|' + c.name.toLowerCase()),
        name: c.name,
        url: c.url,
        logo: c.logo || null,
        countryCode: country.code,
        countryLabel: country.label,
        categoryKey: category.key,
        categoryLabel: category.label,
        language: c.language || null,
        source: c.source
      };

    });

  return {
    channels: enriched,
    sourceStatus,
    generatedAt: new Date().toISOString(),
    total: enriched.length
  };

}
