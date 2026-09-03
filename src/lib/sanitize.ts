import DOMPurify from "isomorphic-dompurify";
import type { UponSanitizeElementHook } from "dompurify";

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
    "p",
    "ul",
    "ol",
    "li",
    "h3",
    "h4",
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

const removeUnlistedIframes: UponSanitizeElementHook = (node, data) => {
    if (data.tagName !== "iframe") return;
    const src = (node as Element).getAttribute("src") ?? "";
    if (!IFRAME_SRC_ALLOWLIST.some((re) => re.test(src))) {
        node.parentNode?.removeChild(node);
    }
};
DOMPurify.addHook("uponSanitizeElement", removeUnlistedIframes);

export function sanitizeHtml(html: string): string {
    return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

// Admin content is split into blocks on blank lines. A block that already
// starts with a tag (an author-written <div>, <p>, <ul>...) is kept as-is,
// so it renders as its own top-level element instead of being buried inside
// an extra wrapper. A plain-text block gets auto-wrapped in <p> so simple
// multi-paragraph text still reads as separate paragraphs.
export function renderContentHtml(content: string): string {
    const blocks = content
        .split(/\n{2,}/)
        .map((b) => b.trim())
        .filter(Boolean)
        .map((b) => (b.startsWith("<") ? b : `<p>${b}</p>`));

    return sanitizeHtml(blocks.join("\n"));
}
