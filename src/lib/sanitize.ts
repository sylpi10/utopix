import DOMPurify from "isomorphic-dompurify";

// Content is typed by the site owner in the protected /admin, not by public
// visitors — sanitizing is a safety net, not a defense against a hostile author.
const ALLOWED_TAGS = [
  "b",
  "strong",
  "i",
  "em",
  "u",
  "br",
  "a",
  "span",
  "div",
  "ul",
  "ol",
  "li",
  "iframe",
];
const ALLOWED_ATTR = [
  "href",
  "target",
  "rel",
  "class",
  "src",
  "width",
  "height",
  "frameborder",
  "allow",
  "allowfullscreen",
  "loading",
  "referrerpolicy",
  "title",
];

// Only let iframes point at embeds we actually expect (map, video) — an
// admin-only content field is still a bad place to allow embedding any URL.
const IFRAME_SRC_ALLOWLIST = [
  /^https:\/\/(www\.)?google\.com\/maps\//,
  /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//,
];

DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName !== "iframe") return;
  const src = (node as Element).getAttribute("src") ?? "";
  if (!IFRAME_SRC_ALLOWLIST.some((re) => re.test(src))) {
    node.parentNode?.removeChild(node);
  }
});

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}
