'use client';

import CategoryPage from '@/components/CategoryPage';

export default function NewsPage() {

  return (
    <CategoryPage
      title="📰 News"
      filter={(c) => c.categoryKey === 'news'}
      emptyMessage="No news channels found in the current sources."
    />
  );

}
