import { NextResponse } from 'next/server';

/**
 * TheSportsDB (thesportsdb.com) - used here because it has a
 * genuinely free tier that covers multiple sports (football,
 * basketball, cricket where a league is on their schedule,
 * etc) without requiring a paid plan for basic livescore/
 * schedule data. Coverage is real but uneven across sports -
 * some leagues update near-live, others are schedule-only.
 * That's a property of the free tier, not something this route
 * pretends around.
 *
 * SPORTS_API_KEY is read from a Vercel Environment Variable so
 * it's never shipped to the browser. TheSportsDB's own public
 * "3" test key is a documented, intentionally-public demo key
 * (not a secret), used ONLY as a local-dev fallback if you
 * haven't set your own key yet - set SPORTS_API_KEY in Vercel
 * for production so you're not sharing the public test key's
 * rate limit with every other app using it.
 */

const FALLBACK_TEST_KEY = '3';

const SPORT_LEAGUE_MAP = {
  football: ['4328', '4331', '4332', '4335'], // EPL, Bundesliga, La Liga, Serie A
  cricket: ['4460'], // ICC / international cricket schedule coverage varies
  basketball: ['4387'], // NBA
  tennis: [], // TheSportsDB's tennis coverage is schedule-based, not league-id based
  baseball: ['4424'], // MLB
  hockey: ['4380'], // NHL
  americanfootball: ['4391'], // NFL
  rugby: ['4986'],
  volleyball: []
};

async function fetchLeagueEvents(apiKey, leagueId) {

  const url = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsnextleague.php?id=${leagueId}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!res.ok) return [];

  const data = await res.json();

  return data.events || [];

}

export async function GET(request) {

  const apiKey = process.env.SPORTS_API_KEY || FALLBACK_TEST_KEY;

  const { searchParams } = new URL(request.url);

  const sport = searchParams.get('sport');

  const leagueIds = sport
    ? SPORT_LEAGUE_MAP[sport] || []
    : Object.values(SPORT_LEAGUE_MAP).flat();

  if (leagueIds.length === 0) {

    return NextResponse.json({
      events: [],
      unavailable: true,
      reason: sport
        ? `The free tier doesn't expose reliable league-level data for "${sport}" yet.`
        : 'No sport specified.'
    });

  }

  try {

    const results = await Promise.all(
      leagueIds.map((id) => fetchLeagueEvents(apiKey, id))
    );

    const events = results
      .flat()
      .filter(Boolean)
      .map((e) => ({
        id: e.idEvent,
        league: e.strLeague,
        homeTeam: e.strHomeTeam,
        awayTeam: e.strAwayTeam,
        homeScore: e.intHomeScore,
        awayScore: e.intAwayScore,
        date: e.dateEvent,
        time: e.strTime,
        status: e.strStatus || 'Scheduled',
        venue: e.strVenue || null,
        thumb: e.strThumb || null
      }));

    return NextResponse.json({
      events,
      unavailable: false,
      generatedAt: new Date().toISOString()
    }, {
      headers: {
        // Live score data goes stale fast - short cache only.
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    });

  }

  catch (err) {

    console.log('NexLive /api/sports failed:', err);

    return NextResponse.json(
      { events: [], unavailable: true, reason: 'Sports data source is temporarily unreachable.' },
      { status: 502 }
    );

  }

}
