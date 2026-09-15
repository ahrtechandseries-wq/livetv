'use client';

import CategoryPage from '@/components/CategoryPage';

export default function InternationalPage() {

  return (
    <CategoryPage
      title="🌍 International"
      filter={(c) => c.countryCode !== 'BD' && c.countryCode !== 'IN'}
      emptyMessage="No international channels found in the current sources."
    />
  );

}
