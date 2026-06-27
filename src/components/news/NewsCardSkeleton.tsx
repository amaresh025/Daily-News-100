import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const isLg = size === 'lg';
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <Skeleton className={`w-full ${isLg ? 'aspect-[16/9]' : 'aspect-[3/2] md:aspect-[4/3]'} rounded-none`} />
      <div className={`p-3 md:p-4 space-y-2 ${isLg ? 'md:p-5' : ''}`}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-20 rounded" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        {isLg && <Skeleton className="h-3 w-full rounded" />}
      </div>
    </div>
  );
};

const TopHeadlineSkeleton = () => (
  <section className="container-blog py-8">
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-lg overflow-hidden">
        <Skeleton className="aspect-[16/10] w-full rounded-none" />
        <div className="p-4 md:p-8 space-y-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-20 rounded" />
          </div>
          <Skeleton className="h-8 w-full rounded" />
          <Skeleton className="h-8 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex gap-3 bg-card border border-border rounded-lg overflow-hidden p-2">
            <Skeleton className="w-32 shrink-0 aspect-[4/3] rounded" />
            <div className="py-2 pr-3 space-y-2 flex-1">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const LatestNewsSkeleton = ({ count = 6 }: { count?: number }) => (
  <section className="container-blog py-10">
    <Skeleton className="h-8 w-48 mb-6 rounded" />
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} size="lg" />)}
    </div>
  </section>
);

const TrendingNewsSkeleton = () => (
  <section className="container-blog py-10 bg-accent/40 rounded-xl my-6">
    <div className="px-2 mb-6">
      <Skeleton className="h-8 w-64 rounded" />
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 px-2">
      {[1, 2, 3, 4].map(i => <CardSkeleton key={i} />)}
    </div>
  </section>
);

const CategorySectionSkeleton = () => (
  <section className="container-blog py-10">
    <div className="flex items-end justify-between mb-6 border-b-2 border-border">
      <Skeleton className="h-8 w-48 pb-3 rounded" />
      <Skeleton className="h-4 w-20 rounded" />
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="lg:col-span-2">
        <CardSkeleton size="lg" />
      </div>
      {[1, 2].map(i => <CardSkeleton key={i} />)}
    </div>
  </section>
);

const MostReadSkeleton = () => (
  <section className="container-blog py-10">
    <Skeleton className="h-8 w-48 mb-6 rounded" />
    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-5">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bg-card border border-border rounded-lg p-4">
          <Skeleton className="h-10 w-10 rounded mb-2" />
          <Skeleton className="h-3 w-16 rounded mb-2" />
          <Skeleton className="h-3 w-full rounded mb-1" />
          <Skeleton className="h-3 w-3/4 rounded mb-2" />
          <Skeleton className="h-3 w-24 rounded" />
        </div>
      ))}
    </div>
  </section>
);

const BreakingTickerSkeleton = () => (
  <div className="bg-[hsl(var(--news-red))] h-10 border-y border-[hsl(var(--news-red))]">
    <div className="container-blog flex items-center h-full">
      <Skeleton className="h-5 w-28 rounded bg-white/20" />
      <div className="ml-4 flex-1">
        <Skeleton className="h-4 w-3/4 rounded bg-white/20" />
      </div>
    </div>
  </div>
);

export { CardSkeleton, TopHeadlineSkeleton, LatestNewsSkeleton, TrendingNewsSkeleton, CategorySectionSkeleton, MostReadSkeleton, BreakingTickerSkeleton };
