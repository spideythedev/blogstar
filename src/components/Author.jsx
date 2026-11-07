import { useEffect, useState } from "react";
import { getAuthor } from "../lib/content";

export default function Author({ username }) {
  const author = getAuthor(username);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;

    fetch(`https://api.github.com/users/${username}`)
      .then((response) => {
        if (!response.ok) throw new Error("Profile unavailable");
        return response.json();
      })
      .then((data) => {
        if (active) setProfile(data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [username]);

  return (
    <a
      className="author"
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer"
    >
      <img
        src={profile?.avatar_url || `https://github.com/${username}.png`}
        alt=""
      />

      <span>
        <strong>{author.displayName}</strong>
        <small>@{username}</small>
      </span>
    </a>
  );
}