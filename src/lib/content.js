import authors from "../content/authors.json";
import config from "../content/config.json";

const postFiles = import.meta.glob("../content/posts/*.json", {
  eager: true,
  import: "default"
});

const posts = Object.values(postFiles).sort(
  (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
);

export function getPosts() {
  return posts;
}

export function getPost(slug) {
  return posts.find((post) => post.slug === slug);
}

export function getAuthor(username) {
  return authors[username] || {
    displayName: username
  };
}

export function getConfig() {
  return config;
}