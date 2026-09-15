/**
 * Duplicate detection across merged M3U sources.
 *
 * Deliberately NOT a plain exact-name match - the same real
 * channel shows up across sources with different
 * capitalization, spacing, punctuation, flag emoji, and
 * HD/FHD/SD suffixes ("Star Sports 1 HD" vs "star sports 1"
 * vs "🇮🇳 Star Sports 1 [HD]"). Normalizing before comparing
 * catches these without merging channels that are only
 * superficially similar (different numbers, different
 * regional feeds).
 */

const QUALITY_SUFFIX_RE =
  /\b(hd|fhd|uhd|4k|sd|hevc|h265)\b/gi;

const PUNCTUATION_RE =
  /[.,'"’`\-_()\[\]{}|:!?]/g;

const FLAG_EMOJI_RE =
  /\p{Regional_Indicator}{2}/gu;

export function normalizeChannelName(rawName) {

  return rawName
    .replace(FLAG_EMOJI_RE, ' ')
    .replace(PUNCTUATION_RE, ' ')
    .replace(QUALITY_SUFFIX_RE, ' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

}

function normalizeUrl(url) {

  try {

    const u = new URL(url);

    // Query strings on IPTV links are frequently per-session
    // tokens (?token=..., ?t=...) - stripping them lets two
    // links to the literal same stream be recognized as the
    // same stream even when their tokens differ.
    return `${u.origin}${u.pathname}`.toLowerCase();

  }

  catch (e) {

    return url.toLowerCase().trim();

  }

}

/**
 * Given a flat array of parsed channel objects (possibly from
 * multiple merged sources), returns a deduplicated array.
 * When two entries are judged the same channel, the one with
 * more complete metadata (logo, country, category all
 * present) is kept.
 */
export function dedupeChannels(channels) {

  const groups = new Map();

  for (const channel of channels) {

    const nameKey = normalizeChannelName(channel.name);

    const urlKey = normalizeUrl(channel.url);

    // Two signals, either one being a match is enough to treat
    // entries as duplicates: identical normalized name (very
    // likely the same channel even via a different mirror
    // URL), OR identical normalized stream URL (definitely the
    // same channel even if named differently across sources).
    let matchedKey = null;

    for (const key of [`n:${nameKey}`, `u:${urlKey}`]) {

      if (groups.has(key)) {

        matchedKey = key;

        break;

      }

    }

    if (!matchedKey) {

      matchedKey = `n:${nameKey}`;

      groups.set(matchedKey, channel);

      // Also index by URL so a later entry with a different
      // name but the same underlying stream still matches.
      groups.set(`u:${urlKey}`, groups.get(matchedKey));

      continue;

    }

    const existing = groups.get(matchedKey);

    const existingScore =
      (existing.logo ? 1 : 0) +
      (existing.country ? 1 : 0) +
      (existing.groupTitle ? 1 : 0);

    const candidateScore =
      (channel.logo ? 1 : 0) +
      (channel.country ? 1 : 0) +
      (channel.groupTitle ? 1 : 0);

    if (candidateScore > existingScore) {

      groups.set(`n:${nameKey}`, channel);
      groups.set(`u:${urlKey}`, channel);

    }

  }

  // groups holds two keys per unique channel (name + url) -
  // collapse back to a unique set via object identity.
  return Array.from(new Set(groups.values()));

}
