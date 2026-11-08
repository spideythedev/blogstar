
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import Author from "./Author";
import SpotlightCard from "./SpotlightCard";

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export default function PostCard({ post }) {
  if (!post) return null;

  return (
    <SpotlightCard className="post-card">
      <article>
        {post.cover && (
          <Link
            to={`/post/${post.slug}`}
            className="post-card-cover"
            tabIndex={-1}
          >
            <img
              src={post.cover}
              alt={post.coverAlt || post.title}
              loading="lazy"
            />
          </Link>
        )}

        <div className="post-card-content">
          <div className="post-card-meta">
            <span>
              <CalendarDays size={14} />
              {formatDate(post.publishedAt)}
            </span>

            {post.readingTime && (
              <span>{post.readingTime} min read</span>
            )}
          </div>

          <h2>
            <Link to={`/post/${post.slug}`}>
              {post.title}
              <ArrowUpRight size={20} />
            </Link>
          </h2>

          {post.description && (
            <p>{post.description}</p>
          )}

          <div className="post-card-bottom">
            <Author username={post.author} />

            <div className="post-card-tags">
              {(post.tags || []).slice(0, 3).map(tag => (
                <span key={tag}>#{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </SpotlightCard>
  );
}
