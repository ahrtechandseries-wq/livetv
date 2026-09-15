/**
 * Best-effort country/category detection from whatever
 * metadata a given M3U entry actually supplies. Real public
 * IPTV playlists are inconsistent - some tag tvg-country
 * properly, many only hint at it through group-title or the
 * channel name itself (a flag emoji, "(BD)", "IN:", etc).
 *
 * This never invents a channel or a country that isn't backed
 * by SOME signal in the source data - it only interprets
 * signals that are already there.
 */

const COUNTRY_PATTERNS = [
  { code: 'BD', label: 'Bangladesh', re: /\bbangladesh\b|\bbd\b|🇧🇩/i },
  { code: 'IN', label: 'India', re: /\bindia\b|\bin\b(?!\w)|🇮🇳/i },
  { code: 'US', label: 'United States', re: /\bunited states\b|\busa\b|\bus\b(?!\w)|🇺🇸/i },
  { code: 'GB', label: 'United Kingdom', re: /\bunited kingdom\b|\buk\b|🇬🇧/i },
  { code: 'PK', label: 'Pakistan', re: /\bpakistan\b|\bpk\b(?!\w)|🇵🇰/i },
  { code: 'AE', label: 'UAE', re: /\buae\b|united arab emirates|🇦🇪/i },
  { code: 'SA', label: 'Saudi Arabia', re: /saudi arabia|\bksa\b|🇸🇦/i }
];

/*
 * BRAND-NAME country overrides, checked BEFORE the generic
 * group-title/name pass below.
 *
 * Why this exists: several real playlists (e.g. a Bangladeshi
 * BDIX aggregator) tag their ENTIRE file's group-title as
 * "Bangladesh" because that's which server/audience carries
 * it - but the file itself re-broadcasts plenty of genuinely
 * Indian channels (Star Sports, Sony, Zee, Colors, etc) for
 * that audience. Trusting group-title alone there mislabels
 * every Indian channel in that source as Bangladeshi.
 *
 * A channel's actual brand name is a much stronger, source-
 * independent signal of its real country of origin than which
 * server happens to carry it, so well-known brands are matched
 * against the channel NAME ONLY (not group-title) and win over
 * the generic pass.
 */

const BRAND_COUNTRY_OVERRIDES = [
  {
    code: 'IN',
    label: 'India',
    re: /star sports|star plus|star gold|star jalsha|star bharat|sony (ten|six|sab|set|max|liv)|zee (tv|cinema|bangla|bihar)|colors\b|sun tv|sun news|ndtv|aaj tak|india today|doordarshan|\bdd\b (national|news|bangla)|republic (tv|bharat)|times now|abp (news|ananda)|news18|cnn-news18|dangal tv|discovery jeet|z bangla|sansad tv/i
  },
  {
    code: 'BD',
    label: 'Bangladesh',
    re: /\bbtv\b|atn bangla|atn news|channel 24|jamuna tv|\bntv\b|somoy tv|ekushey tv|gazi tv|\bgtv\b|boishakhi tv|duronto tv|independent tv|mohona tv|asian tv|maasranga|\brtv\b|bangla ?vision|dbc news|desh tv|nexus tv|digant tv|my tv bangladesh/i
  }
];

export function detectCountry(channel) {

  if (channel.country) {

    const upper = channel.country.toUpperCase().trim();

    const known = COUNTRY_PATTERNS.find((c) => c.code === upper);

    if (known) return known;

    // tvg-country supplied something we don't have a curated
    // label for - keep it rather than discarding real signal.
    if (upper) {

      return { code: upper, label: channel.country, re: null };

    }

  }

  /*
   * Brand override pass - name-only, wins over source/group
   * metadata. See BRAND_COUNTRY_OVERRIDES comment above for
   * why this has to run before the generic pass below.
   */

  for (const override of BRAND_COUNTRY_OVERRIDES) {

    if (override.re.test(channel.name)) return override;

  }

  const haystack = `${channel.groupTitle} ${channel.name}`;

  for (const pattern of COUNTRY_PATTERNS) {

    if (pattern.re.test(haystack)) return pattern;

  }

  return { code: 'OTHER', label: 'Other', re: null };

}

const CATEGORY_RULES = [
  { key: 'sports', label: 'Sports', re: /sport|cricket|football|soccer|espn|ten sports|star sports|ptv sports|sony ten/i },
  { key: 'news', label: 'News', re: /news|24x7|al jazeera|aljazeera|bbc|cnn|ndtv/i },
  { key: 'kids', label: 'Cartoon/Kids', re: /kids?|cartoon|disney|nickelodeon|pogo|hungama|nick jr/i },
  { key: 'movies', label: 'Movies', re: /movie|cinema|films?\b/i },
  { key: 'entertainment', label: 'Entertainment', re: /entertain|drama|star plus|zee tv|colors/i },
  { key: 'music', label: 'Music', re: /music|mtv|vh1|gaana/i },
  { key: 'religious', label: 'Religious', re: /islamic|quran|peace tv|god tv|religious|church/i },
  { key: 'documentary', label: 'Documentary', re: /documentary|discovery|national geographic|nat geo|history channel/i }
];

export function detectCategory(channel) {

  const haystack = `${channel.groupTitle} ${channel.name}`;

  for (const rule of CATEGORY_RULES) {

    if (rule.re.test(haystack)) return rule;

  }

  if (channel.groupTitle) {

    return { key: 'other', label: channel.groupTitle };

  }

  return { key: 'other', label: 'Other' };

}
