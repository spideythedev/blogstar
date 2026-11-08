
import config from "../../content/config.json";
import authors from "../../content/authors.json";
import posts from "../../content/posts.json";

export function getConfig() {
  return config;
}

export function getAuthors() {
  return authors;
}

export function getAuthor(username) {
  return authors[username] || null;
}

export function getPosts() {
  return [...posts].sort(
    (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
  );
}

export function getPost(slug) {
  return posts.find(post => post.slug === slug) || null;
}

export function getTags() {
  return [...new Set(posts.flatMap(post => post.tags || []))].sort();
}
