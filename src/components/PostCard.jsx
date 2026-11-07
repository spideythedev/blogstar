import { Link } from "react-router-dom";
import Author from "./Author";

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      {post.cover && (
        <Link to={`/post/${post.slug}`}>
          <img className="post-cover" src={post.cover} alt="" />
        </Link>
      )}

      <div className="post-meta">
        <span>{post.publishedAt}</span>
        <span>·</span>
        <span>{post.tags?.[0] || "Thoughts"}</span>
      </div>

      <h2>
        <Link to={`/post/${post.slug}`}>{post.title}</Link>
      </h2>

      <p>{post.description}</p>

      <Author username={post.author} />

      <Link className="read-link" to={`/post/${post.slug}`}>
        Read this <span>↗</span>
      </Link>
    </article>
  );
}