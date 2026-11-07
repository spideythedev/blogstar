import { useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import PostCard from "./components/PostCard";
import Author from "./components/Author";
import { getPosts, getPost, getConfig } from "./lib/content";

function Header({ dark, setDark }) {
  const config = getConfig();

  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-star">★</span>
        <span>{config.name}</span>
      </Link>

      <div className="header-right">
        <span className="header-tagline">{config.tagline}</span>
        <button
          className="theme-toggle"
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}

function Home() {
  const posts = getPosts();
  const config = getConfig();

  return (
    <main>
      <section className="intro">
        <span className="eyebrow">A little corner of the internet ★</span>
        <h1>
          Just your
          <br />
          <span>thoughts.</span>
        </h1>
        <p>{config.description}</p>
      </section>

      <section className="posts-section">
        <div className="section-heading">
          <h2>Recent writing</h2>
          <span>{posts.length} posts</span>
        </div>

        {posts.length ? (
          <div className="post-list">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="empty">Nothing here yet. Check back soon.</p>
        )}
      </section>
    </main>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case "paragraph":
      return <p>{block.text}</p>;

    case "heading": {
      const level = Math.min(6, Math.max(2, block.level || 2));
      const Heading = `h${level}`;
      return <Heading>{block.text}</Heading>;
    }

    case "quote":
      return <blockquote>{block.text}</blockquote>;

    case "image":
      return (
        <figure>
          <img src={block.src} alt={block.alt || ""} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "video":
      return (
        <video controls preload="metadata" src={block.src}>
          Your browser does not support video.
        </video>
      );

    case "audio":
      return <audio controls preload="metadata" src={block.src} />;

    case "code":
      return (
        <pre>
          <code>{block.code}</code>
        </pre>
      );

    case "divider":
      return <hr />;

    default:
      return null;
  }
}

function PostPage() {
  const { slug } = useParams();
  const post = getPost(slug);

  if (!post) {
    return (
      <main className="not-found">
        <h1>Couldn't find that post.</h1>
        <Link to="/">Go back home ↗</Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> All posts
      </Link>

      <div className="article-meta">
        {post.publishedAt} · {post.tags?.join(", ")}
      </div>

      <h1 className="article-title">{post.title}</h1>
      <p className="article-description">{post.description}</p>

      <Author username={post.author} />

      {post.cover && (
        <img className="article-cover" src={post.cover} alt="" />
      )}

      <article className="article-content">
        {post.content?.map((block, index) => (
          <ContentBlock key={index} block={block} />
        ))}
      </article>
    </main>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "app dark" : "app"}>
      <Header dark={dark} setDark={setDark} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:slug" element={<PostPage />} />
      </Routes>

      <footer className="footer">
        <span>★</span>
        <p>Just Your Thoughts.</p>
        <small>Blog★Star · Open source</small>
      </footer>
    </div>
  );
}