'use client';

import CategoryPage from '@/components/CategoryPage';

export default function LiveTvPage() {

  return (
    <CategoryPage
      title="Live TV"
      filter={null}
      emptyMessage="No channels available right now."
    />
  );

}
