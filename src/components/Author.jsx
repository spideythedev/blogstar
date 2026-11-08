
import { Github } from "lucide-react";
import { getAuthor } from "../lib/content";

export default function Author({ username }) {
  if (!username) return null;

  const author = getAuthor(username);
  const displayName = author?.displayName || username;

  return (
    <a
      className="author"
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`${displayName} on GitHub`}
    >
      {author?.avatar ? (
        <img src={author.avatar} alt="" loading="lazy" />
      ) : (
        <span className="author-avatar">
          {displayName.charAt(0).toUpperCase()}
        </span>
      )}

      <span>{displayName}</span>
      <Github size={14} />
    </a>
  );
}
