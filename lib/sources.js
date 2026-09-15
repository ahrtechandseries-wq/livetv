/**
 * Input playlist sources. Raw/public URLs only - GitHub's HTML
 * blob page (github.com/.../blob/...) is never fetched
 * directly, since parsing GitHub's HTML instead of the actual
 * playlist would break the moment their page markup changes,
 * and CORS may not even permit it. Everything here resolves to
 * the actual playlist text.
 */

export const PLAYLIST_SOURCES = [
  {
    name: 'BDIX Server',
    label: '🇧🇩 BDIX Server',
    url: 'https://raw.githubusercontent.com/abusaeeidx/Mrgify-BDIX-IPTV/main/playlist.m3u'
  },
  {
    name: 'Rokon IPTV',
    label: 'Rokon IPTV',
    url: 'https://raw.githubusercontent.com/time2shine/Rokon-IPTV/main/playlist.m3u'
  },
  {
    name: 'Sports Server',
    label: '⚽ Sports Server',
    url: 'https://iptv-org.github.io/iptv/categories/sports.m3u'
  },
  {
    name: 'Global Server',
    label: '🌍 Global Server',
    url: 'https://iptv-org.github.io/iptv/index.m3u'
  }
];
