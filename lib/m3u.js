/**
 * Parses raw M3U/M3U8 playlist TEXT (not a stream) into a flat
 * array of channel objects. Handles the #EXTINF attribute
 * formats actually used by real-world IPTV playlists:
 *
 *   #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..."
 *     tvg-country="BD" tvg-language="Bengali"
 *     group-title="News",Channel Name
 *   https://example.com/stream.m3u8
 *
 * Every field is optional except the stream URL - real
 * playlists are inconsistent about which attributes they
 * include, so nothing here assumes a field exists.
 */

function parseAttributes(extinfLine) {

  const attrs = {};

  const attrRegex = /([a-zA-Z0-9-]+)="([^"]*)"/g;

  let match;

  while ((match = attrRegex.exec(extinfLine)) !== null) {

    attrs[match[1].toLowerCase()] = match[2];

  }

  // Whatever comes after the last comma on the #EXTINF line is
  // the display name (tvg-name is a hint, not always present).
  const commaIndex = extinfLine.lastIndexOf(',');

  const displayName =
    commaIndex >= 0
      ? extinfLine.slice(commaIndex + 1).trim()
      : '';

  return { attrs, displayName };

}

export function parseM3U(text, sourceName) {

  if (!text || typeof text !== 'string') {

    return [];

  }

  const lines = text.split(/\r?\n/);

  const channels = [];

  let pendingExtinf = null;

  let pendingGroupOverride = null;

  for (let i = 0; i < lines.length; i++) {

    const line = lines[i].trim();

    if (!line) continue;

    if (line.startsWith('#EXTINF')) {

      pendingExtinf = parseAttributes(line);

      continue;

    }

    if (line.startsWith('#EXTGRP:')) {

      pendingGroupOverride = line.slice('#EXTGRP:'.length).trim();

      continue;

    }

    if (line.startsWith('#')) {

      // Any other directive (#EXTM3U, #EXTVLCOPT, etc.) - not
      // channel data, skip without losing our place.
      continue;

    }

    // A non-comment, non-empty line that isn't itself a
    // directive is a stream URL.
    if (!pendingExtinf) {

      // A URL with no preceding #EXTINF is malformed for our
      // purposes - there's no name/metadata to show a viewer,
      // so it's dropped rather than shown as a blank channel.
      continue;

    }

    const { attrs, displayName } = pendingExtinf;

    const name =
      (attrs['tvg-name'] || displayName || '').trim();

    if (name && line) {

      channels.push({
        name,
        url: line,
        logo: attrs['tvg-logo'] || '',
        groupTitle:
          pendingGroupOverride ||
          attrs['group-title'] ||
          '',
        country: attrs['tvg-country'] || '',
        language: attrs['tvg-language'] || '',
        tvgId: attrs['tvg-id'] || '',
        source: sourceName || ''
      });

    }

    pendingExtinf = null;
    pendingGroupOverride = null;

  }

  return channels;

}
