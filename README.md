# NexLive

Premium live TV + sports streaming, by **AHR**. Original dark
cinematic UI — not a Netflix reskin.

## Stack

- Next.js 14 (App Router, JavaScript)
- Tailwind CSS
- hls.js for `.m3u8` playback
- Zero database — the channel catalogue is built at request
  time from public M3U playlists (cached, see below); favorites
  and recently-watched live in `localStorage`

## Architecture (and why there's no video proxy)

```
Browser  ──GET /api/channels──▶  Vercel serverless function
                                   │
                                   ▼
                         fetches + parses + dedupes
                         the M3U sources server-side,
                         cached ~30 min (see revalidate
                         in app/api/channels/route.js)

Browser  ──plays stream URL directly──▶  the stream's own host
                         (hls.js / <video>, NO proxy in between)

Browser  ──GET /api/sports──▶  Vercel serverless function
                                   │
                                   ▼
                         calls TheSportsDB with
                         SPORTS_API_KEY (server-side only)
```

Two very different things both start with "fetch on the
server," and it's worth being precise about which is which:

- **Playlist aggregation** (`/api/channels`) fetches *playlist
  text* (a few KB of `.m3u`), not video. Doing this server-side
  is what makes the "don't re-download/re-parse on every page
  load" requirement possible, via the route's cached
  `revalidate` window.
- **Video playback** never goes through the Vercel function at
  all. `components/Player.js` hands the stream's real URL
  straight to hls.js / `<video>`, and the browser talks to the
  stream's own host directly. **This is not a proxy** — if a
  given stream's host blocks cross-origin playback, that stream
  will fail in NexLive exactly like it would in any other
  direct player, and no server-side workaround is included by
  design.

## Setup

```bash
npm install
cp .env.example .env.local   # optional: add your own SPORTS_API_KEY
npm run dev
```

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. (Optional) Add `SPORTS_API_KEY` under Project → Settings →
   Environment Variables — get a free one at
   https://www.thesportsdb.com/free_api.php. Without it, sports
   data still works via TheSportsDB's public shared test key,
   just with a shared rate limit.
4. Deploy. No other secrets are required — the channel catalogue
   needs no key at all.

## What's real vs. what to extend

Built and genuinely working:
- Live playlist aggregation from the 4 usable public sources
  (see note below on source #4), with real parsing, country/
  category detection, and duplicate merging
- Direct HLS/native playback with bounded retry + auto-skip to
  a related channel on repeated failure
- Sports live/upcoming scores from TheSportsDB's free tier
- Favorites, recently watched, search — all real, local-only
  (no login)
- Splash screen, responsive nav, TV-friendly focus states

Known, honest limitations (per the "don't pretend it works"
requirement):
- **Source #4** (`github.com/iptv-org/iptv.git`) is a git
  repository, not a fetchable playlist file — fetching it
  directly from a browser/serverless function isn't meaningful.
  `lib/sources.js` uses that same project's own published
  outputs instead (`iptv-org.github.io/iptv/index.m3u` and
  `.../categories/sports.m3u`), which are the real, intended
  public deliverables of that repo.
- **Sports coverage is uneven** — TheSportsDB's free tier has
  solid football/basketball/hockey/baseball schedule+score data,
  but thinner coverage for tennis/volleyball (no stable
  league-id endpoint on the free tier for those two right now,
  so those pages will honestly show "data unavailable" rather
  than fake scores).
- **A stream failing to play is a property of that stream's
  host**, not something NexLive can fix — some public IPTV
  links go down, rotate, or block certain regions/referrers.
  The retry+skip logic handles this gracefully but can't make a
  dead link work.
- Channel **logos** come from whatever `tvg-logo` a source
  provides — some channels simply don't have one, and the
  channel card falls back to a text tile instead of guessing.

## Project structure

```
app/                 routes (App Router)
  api/channels/       playlist aggregation endpoint
  api/sports/         sports score endpoint
  watch/[id]/         player + channel detail page
  sports/[sport]/     per-sport page
components/          UI components
lib/                 parsing, dedupe, ranking, storage helpers
hooks/               client data hooks
```


## NexLive Admin CMS

Open `/admin`. Set `NEXLIVE_ADMIN_SECRET` on the server. For persistent production data, create a Cloudflare KV namespace and configure `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_KV_NAMESPACE_ID`, and a server-side `CLOUDFLARE_API_TOKEN` with KV read/write permission.

The admin can add/edit/delete/enable/disable/reorder channels, import M3U playlists for preview, and manage site/player branding. Never expose the Cloudflare token or admin secret to the browser bundle.
