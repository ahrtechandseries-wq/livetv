'use client';

import CategoryPage from '@/components/CategoryPage';

export default function IndiaPage() {

  return (
    <CategoryPage
      title="🇮🇳 India"
      filter={(c) => c.countryCode === 'IN'}
      emptyMessage="No India channels found in the current sources."
    />
  );

}
