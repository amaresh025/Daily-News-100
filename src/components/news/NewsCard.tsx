import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { PostRow, formatDate } from '@/hooks/usePosts';

interface NewsCardProps {
  post: PostRow;
  size?: 'sm' | 'md' | 'lg';
}

const NewsCard = ({ post, size = 'md' }: NewsCardProps) => {
  const isLg = size === 'lg';
  return (
    <article className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-md hover:border-primary/40 transition-all flex flex-col h-full">
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden">
        <div className={`${isLg ? 'aspect-[16/9]' : 'aspect-[3/2] md:aspect-[4/3]'}`}>
          <img
            src={post.featured_image ?? ''}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
      </Link>
      <div className={`p-3 md:p-4 space-y-2 flex-1 flex flex-col justify-between ${isLg ? 'md:p-5' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {post.categories && (
              <Link to={`/category/${post.categories.slug}`} className="badge-category hover:bg-primary hover:text-primary-foreground transition-colors">
                {post.categories.name}
              </Link>
            )}
            <span className="text-[10px] md:text-[11px] text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatDate(post.published_at)}
            </span>
          </div>
          <Link to={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
            <h3 className={`font-bold leading-snug line-clamp-3 ${isLg ? 'text-base md:text-xl' : 'text-sm md:text-base'}`}>
              {post.title}
            </h3>
          </Link>
          {isLg && post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
          )}
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
