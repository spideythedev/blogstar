
import { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useParams
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Github,
  Heart,
  Moon,
  Sun,
  Star,
  ExternalLink,
  Code2
} from "lucide-react";

import PostCard from "./components/PostCard";
import Author from "./components/Author";
import {
  getPosts,
  getPost,
  getConfig,
  getAuthor
} from "./lib/content";

const REPO = "https://github.com/spideythedev/blogstar";
const GITHUB_API = "https://api.github.com/repos/spideythedev/blogstar";

function useStars() {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(GITHUB_API)
      .then((response) => {
        if (!response.ok) throw new Error("GitHub unavailable");
        return response.json();
      })
      .then((data) => {
        if (active) setStars(data.stargazers_count);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return stars;
}

function RichText({ text = "" }) {
  const parts = text.split(/(@[a-zA-Z0-9-]+)/g);

  return parts.map((part, index) => {
    if (!part.startsWith("@")) {
      return <span key={index}>{part}</span>;
    }

    const username = part.slice(1);
    const author = getAuthor(username);

    return (
      <a
        key={index}
        className="mention"
        href={`https://github.com/${username}`}
        target="_blank"
        rel="noreferrer"
        title={`@${username} on GitHub`}
      >
        @{author.displayName}
      </a>
    );
  });
}

function Header({ dark, setDark }) {
  const config = getConfig();

  return (
    <header className="header">
      <Link to="/" className="brand">
        <span className="brand-star">★</span>
        <span>{config.name}</span>
      </Link>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/credits">Credits</Link>
      </nav>

      <button
        className="theme-toggle"
        onClick={() => setDark(!dark)}
        aria-label="Toggle theme"
      >
        {dark ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}

function StarLink({ stars }) {
  return (
    <a
      href={REPO}
      target="_blank"
      rel="noreferrer"
      className="star-link"
    >
      <Github size={19} />
      <span>Drop a star</span>
      <Star size={15} />
      <strong>{stars === null ? "★" : stars}</strong>
    </a>
  );
}

function Home() {
  const posts = getPosts();
  const config = getConfig();
  const stars = useStars();

  return (
    <main>
      <section className="intro">
        <span className="eyebrow">
          A little corner of the internet ★
        </span>

        <h1>
          Just your
          <br />
          <span className="highlight">thoughts.</span>
        </h1>

        <p>{config.description}</p>

        <div className="intro-actions">
          <Link to="/posts" className="primary-link">
            Read some posts <ArrowRight size={17} />
          </Link>

          <a href={REPO} target="_blank" rel="noreferrer" className="text-link">
            GitHub <ExternalLink size={14} />
          </a>
        </div>

        <div className="hero-decoration">✳</div>
      </section>

      <section className="posts-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Fresh from the community</span>
            <h2>Recent writing</h2>
          </div>

          <Link to="/posts" className="text-link">
            All posts <ArrowRight size={15} />
          </Link>
        </div>

        <div className="post-list">
          {posts.slice(0, 4).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>

        {!posts.length && (
          <p className="empty">
            Nothing here yet. Maybe you'll be the first?
          </p>
        )}
      </section>

      <section className="community">
        <div className="community-star">★</div>
        <div>
          <h2>Enjoying this little place?</h2>
          <p>
            Blog★Star is open source. If you like what we're building,
            drop us a star on GitHub. It genuinely helps!
          </p>
          <StarLink stars={stars} />
        </div>
      </section>
    </main>
  );
}

function PostsPage() {
  const posts = getPosts();

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">The community's words</span>
        <h1>All the <span className="highlight">posts.</span></h1>
        <p>Things people wanted to share with the world.</p>
      </div>

      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {!posts.length && (
        <p className="empty">No posts yet. Stay around!</p>
      )}
    </main>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case "paragraph":
      return <p><RichText text={block.text} /></p>;

    case "heading": {
      const level = Math.min(6, Math.max(2, block.level || 2));
      const Heading = `h${level}`;
      return <Heading><RichText text={block.text} /></Heading>;
    }

    case "quote":
      return <blockquote><RichText text={block.text} /></blockquote>;

    case "image":
      return (
        <figure>
          <img src={block.src} alt={block.alt || ""} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "video":
      return <video controls preload="metadata" src={block.src} />;

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
      <main className="page not-found">
        <h1>Well, that's awkward.</h1>
        <p>Couldn't find that post.</p>
        <Link to="/" className="text-link">Go home <ArrowRight size={15} /></Link>
      </main>
    );
  }

  return (
    <main className="article-page">
      <Link to="/posts" className="back-link">
        <ArrowLeft size={16} /> All posts
      </Link>

      <div className="article-meta">
        {post.publishedAt} · {post.tags?.join(", ")}
      </div>

      <h1 className="article-title">
        <RichText text={post.title} />
      </h1>

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

function Guide() {
  return (
    <main className="page document-page">
      <span className="eyebrow">A little help</span>
      <h1>The <span className="highlight">guide.</span></h1>
      <p className="page-lead">
        Want to share something here? Here's how it works.
      </p>

      <section className="guide-section">
        <h2>01. Get the project</h2>
        <p>Fork the <a href={REPO}>Blog★Star repository</a> on GitHub.</p>
        <p>Clone your fork and open it in your editor.</p>
        <pre><code>git clone YOUR_FORK_URL</code></pre>
      </section>

      <section className="guide-section">
        <h2>02. Add yourself</h2>
        <p>Open <code>src/content/authors.json</code>.</p>
        <pre><code>{`{
  "your-github-username": {
    "displayName": "Your Name"
  }
}`}</code></pre>
        <p>Use your actual GitHub username as the key. The display name is what readers will see.</p>
      </section>

      <section className="guide-section">
        <h2>03. Write a post</h2>
        <p>Create a JSON file inside <code>src/content/posts/</code>.</p>
        <pre><code>{`{
  "slug": "my-first-post",
  "title": "Hello, world!",
  "description": "Just something I wanted to share.",
  "author": "your-github-username",
  "publishedAt": "2026-11-08",
  "tags": ["Thoughts"],
  "content": [
    {
      "type": "paragraph",
      "text": "Hey! This is my first post."
    }
  ]
}`}</code></pre>
      </section>

      <section className="guide-section">
        <h2>04. Mention someone</h2>
        <p>
          Write <code>@githubusername</code> inside a paragraph.
          Blog★Star turns it into a GitHub profile link and uses
          their custom display name.
        </p>
      </section>

      <section className="guide-section">
        <h2>05. Publish it</h2>
        <p>
          Commit your changes, push them to your fork, and open a
          pull request. Once it's merged, your post will appear
          after the website rebuilds.
        </p>
      </section>

      <section className="guide-section">
        <h2>Markdown and content blocks</h2>
        <p>Blog★Star uses JSON content blocks in this version.</p>
        <ul>
          <li><code>paragraph</code> — normal writing and mentions</li>
          <li><code>heading</code> — section headings, with a level</li>
          <li><code>quote</code> — highlighted quotations</li>
          <li><code>image</code> — images with optional captions</li>
          <li><code>video</code> — playable video files</li>
          <li><code>audio</code> — playable audio files</li>
          <li><code>code</code> — code snippets</li>
          <li><code>divider</code> — a section separator</li>
        </ul>
        <p>
          More Hyper MD blocks can be added as the format grows.
        </p>
      </section>

      <a href={REPO} className="primary-link">
        Get started on GitHub <ArrowRight size={16} />
      </a>
    </main>
  );
}

function Credits() {
  const stars = useStars();

  return (
    <main className="page document-page">
      <span className="eyebrow">The people and tools behind it</span>
      <h1>Made with <span className="highlight">care.</span></h1>
      <p className="page-lead">
        A small project built for people who have something to say.
      </p>

      <section className="credit-item">
        <Code2 size={22} />
        <div>
          <h2>Built by</h2>
          <a href="https://github.com/spideythedev">
            Fahad Malik (@spideythedev)
          </a>
          <p>The person building Blog★Star.</p>
        </div>
      </section>

      <section className="credit-item">
        <Github size={22} />
        <div>
          <h2>Open source</h2>
          <a href={REPO}>github.com/spideythedev/blogstar</a>
          <p>Read the code, contribute, or make your own version.</p>
          <StarLink stars={stars} />
        </div>
      </section>

      <section className="credit-item">
        <Heart size={22} />
        <div>
          <h2>Made possible by</h2>
          <p>React, Vite, Lucide, GitHub and everyone who contributes.</p>
        </div>
      </section>

      <section className="credit-item">
        <BookOpen size={22} />
        <div>
          <h2>Contributors</h2>
          <p>Every person who shares an idea, fixes something or helps this project grow.</p>
          <a href={`${REPO}/graphs/contributors`}>Meet the contributors <ArrowRight size={14} /></a>
        </div>
      </section>
    </main>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="footer-star">★</span>
      <p>Just Your Thoughts.</p>

      <div className="footer-links">
        <Link to="/posts">Posts</Link>
        <Link to="/guide">Guide</Link>
        <Link to="/credits">Credits</Link>
        <a href={REPO}>GitHub</a>
      </div>

      <small>Made with care, not a lot of rules.</small>
    </footer>
  );
}

export default function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("blogstar-theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("blogstar-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className={dark ? "app dark" : "app"}>
      <Header dark={dark} setDark={setDark} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/post/:slug" element={<PostPage />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>

      <Footer />
    </div>
  );
}
