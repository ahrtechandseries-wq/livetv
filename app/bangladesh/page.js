'use client';

import CategoryPage from '@/components/CategoryPage';

export default function BangladeshPage() {

  return (
    <CategoryPage
      title="🇧🇩 Bangladesh"
      filter={(c) => c.countryCode === 'BD'}
      emptyMessage="No Bangladesh channels found in the current sources."
    />
  );

}
