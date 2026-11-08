
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
  Code2,
  Sparkles
} from "lucide-react";

import PostCard from "./components/PostCard";
import Author from "./components/Author";
import { getPosts, getPost, getConfig, getAuthor } from "./lib/content";

const REPO = "https://github.com/spideythedev/blogstar";
const GITHUB_API = "https://api.github.com/repos/spideythedev/blogstar";

function useStars() {
  const [stars, setStars] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch(GITHUB_API, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("GitHub unavailable");
        return response.json();
      })
      .then((data) => setStars(data.stargazers_count))
      .catch(() => {});

    return () => controller.abort();
  }, []);

  return stars;
}

function RichText({ text = "" }) {
  const tokens = text.split(
    /(@[a-zA-Z0-9-]+|\[\[(?:coral|blue|green):.*?\]\])/g
  );

  return tokens.map((token, index) => {
    const mention = token.match(/^@([a-zA-Z0-9-]+)$/);

    if (mention) {
      const username = mention[1];
      const author = getAuthor(username);

      return (
        <a
          key={index}
          className="mention"
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
        >
          @{author.displayName}
        </a>
      );
    }

    const highlight = token.match(
      /^\[\[(coral|blue|green):(.*?)\]\]$/
    );

    if (highlight) {
      return (
        <span
          key={index}
          className={`text-highlight highlight-${highlight[1]}`}
        >
          {highlight[2]}
        </span>
      );
    }

    return <span key={index}>{token}</span>;
  });
}

function Header({ dark, setDark }) {
  const config = getConfig();

  return (
    <header className="header">
      <Link to="/" className="brand" aria-label="BlogStar home">
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
        aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
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
      <Github size={18} />
      <span>Drop a star</span>
      <Star size={15} />
      <strong>{stars === null ? "—" : stars?.toLocaleString()}</strong>
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
        <div className="intro-copy">
          <span className="eyebrow">
            <Sparkles size={14} />
            A little corner of the internet
          </span>

          <h1>
            Just your
            <br />
            <span className="highlight-coral">thoughts.</span>
          </h1>

          <p>
            {config.description ||
              "Little thoughts, long stories, random experiments, and things you just want to share."}
          </p>

          <div className="intro-actions">
            <Link to="/posts" className="primary-link">
              Have a look <ArrowRight size={17} />
            </Link>

            <a
              href={REPO}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Our GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <span>★</span>
          <small>WRITE<br />YOUR<br />WAY</small>
        </div>
      </section>

      <section className="posts-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">From people, not algorithms</span>
            <h2>Recently written.</h2>
          </div>

          <Link to="/posts" className="text-link">
            All posts <ArrowRight size={15} />
          </Link>
        </div>

        {posts.length ? (
          <div className="post-list">
            {posts.slice(0, 4).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="empty">
            Nothing here just yet. Maybe you'll be the first?
          </p>
        )}
      </section>

      <section className="community">
        <div className="community-star">★</div>

        <div className="community-content">
          <span className="eyebrow">Built in the open</span>
          <h2>Hey, we're on GitHub!</h2>
          <p>
            BlogStar is open source. You can read the code,
            suggest something, fix a bug, or just drop a star.
            Every bit of support means something.
          </p>

          <StarLink stars={stars} />
        </div>
      </section>
    </main>
  );
}

function PostsPage() {
  const posts = getPosts();
  const [activeTag, setActiveTag] = useState("All");

  const tags = [
    "All",
    ...new Set(posts.flatMap((post) => post.tags || []))
  ];

  const filteredPosts = activeTag === "All"
    ? posts
    : posts.filter((post) => post.tags?.includes(activeTag));

  return (
    <main className="page">
      <div className="page-heading">
        <span className="eyebrow">A collection of thoughts</span>
        <h1>All the <span className="highlight-coral">posts.</span></h1>
        <p>Different people. Different thoughts. All in one place.</p>
      </div>

      <div className="tag-filters">
        {tags.map((tag) => (
          <button
            key={tag}
            className={activeTag === tag ? "tag-filter active" : "tag-filter"}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="post-list">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {!filteredPosts.length && (
        <p className="empty">No posts with this tag yet.</p>
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
          <img src={block.src} alt={block.alt || ""} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );

    case "video":
      return (
        <video controls preload="metadata" src={block.src}>
          Your browser doesn't support this video.
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
      <main className="page not-found">
        <h1>Hmm, can't find that one.</h1>
        <p>Maybe the link is old, or the post moved.</p>
        <Link to="/posts" className="text-link">
          <ArrowLeft size={16} /> Back to posts
        </Link>
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
        <img
          className="article-cover"
          src={post.cover}
          alt=""
          fetchPriority="high"
        />
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
      <span className="eyebrow">Before you start</span>
      <h1>The <span className="highlight-coral">guide.</span></h1>

      <p className="page-lead">
        Got something to write about? Nice. Here's how to get it here.
      </p>

      <section className="guide-section">
        <h2>01. Fork the repository</h2>
        <p>
          Head over to our GitHub repository and fork it.
          That's your own copy to work with.
        </p>
        <a href={REPO} className="text-link">
          Open repository <ExternalLink size={14} />
        </a>
      </section>

      <section className="guide-section">
        <h2>02. Add your name</h2>
        <p>
          Open <code>src/content/authors.json</code> and add yourself.
        </p>
        <pre><code>{`{
  "your-github-username": {
    "displayName": "Your Name"
  }
}`}</code></pre>
      </section>

      <section className="guide-section">
        <h2>03. Write something</h2>
        <p>
          Create a new JSON file inside
          <code> src/content/posts/</code>.
          Give it a unique filename and fill in your post.
        </p>
        <pre><code>{`{
  "slug": "my-first-post",
  "title": "Something I wanted to share",
  "description": "A little introduction.",
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
        <h2>04. Add a little colour</h2>
        <p>
          You can highlight words inside paragraphs and headings.
        </p>
        <pre><code>{`[[coral:Something important]]
[[blue:A useful link]]
[[green:A little positive note]]`}</code></pre>
        <p>These are BlogStar's own inline highlights, not Markdown syntax.</p>
      </section>

      <section className="guide-section">
        <h2>05. Mention someone</h2>
        <p>
          Write <code>@githubusername</code> in your paragraph.
          We'll turn it into their GitHub profile link and use
          their display name from authors.json.
        </p>
      </section>

      <section className="guide-section">
        <h2>06. Send a pull request</h2>
        <p>
          Commit your changes, push to your fork, and open a PR.
          Once it's reviewed and merged, your post will show up
          after the next deployment.
        </p>
      </section>

      <Link to="/posts" className="primary-link">
        Have a look at the posts <ArrowRight size={16} />
      </Link>
    </main>
  );
}

function Credits() {
  const stars = useStars();

  return (
    <main className="page document-page">
      <span className="eyebrow">A little appreciation</span>
      <h1>Made with <span className="highlight-coral">care.</span></h1>

      <p className="page-lead">
        It's a small project, but there's a bit of work behind it.
        Here's where it all comes from.
      </p>

      <section className="credit-item">
        <Code2 size={22} />
        <div>
          <h2>The person behind it</h2>
          <a href="https://github.com/spideythedev">
            Fahad Malik (@spideythedev)
          </a>
          <p>Building BlogStar and figuring things out along the way.</p>
        </div>
      </section>

      <section className="credit-item">
        <Github size={22} />
        <div>
          <h2>The repository</h2>
          <a href={REPO}>spideythedev/blogstar</a>
          <p>Open source. Take a look, contribute, or make something with it.</p>
          <StarLink stars={stars} />
        </div>
      </section>

      <section className="credit-item">
        <Heart size={22} />
        <div>
          <h2>The tools</h2>
          <p>
            React, Vite, Lucide, React Bits, Icons8 and GitHub.
            All doing their little part.
          </p>
        </div>
      </section>

      <section className="credit-item">
        <BookOpen size={22} />
        <div>
          <h2>The contributors</h2>
          <p>
            Everyone who writes, reviews, fixes bugs or shares an idea.
            You're part of this too.
          </p>
          <a href={`${REPO}/graphs/contributors`}>
            See contributors <ArrowRight size={14} />
          </a>
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

      <small>Made with care. Shared with everyone.</small>
    </footer>
  );
}

export default function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("blogstar-theme") === "dark"
  );

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
