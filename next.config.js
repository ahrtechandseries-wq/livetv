/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    // Channel logos come from arbitrary third-party hosts
    // supplied by the M3U sources themselves (tvg-logo), so we
    // can't whitelist every hostname in advance. remotePatterns
    // with a wildcard-ish "**" keeps next/image working without
    // silently breaking every time a new source is merged in.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ]
  }
};

module.exports = nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
