'use client';

import CategoryPage from '@/components/CategoryPage';

export default function KidsPage() {

  return (
    <CategoryPage
      title="🧸 Cartoon/Kids"
      filter={(c) => c.categoryKey === 'kids'}
      emptyMessage="No kids/cartoon channels found in the current sources."
    />
  );

}
