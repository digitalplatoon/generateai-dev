import DOMPurify from "dompurify";

/**
 * DOMPurify needs a real DOM, which does not exist during server rendering.
 * On the server we fall back to escaping everything except a small allowlist
 * of formatting tags, so markup is never injected unsanitised.
 */
const SERVER_ALLOWED = /^(br|b|i|em|strong|p|ul|ol|li|code|pre)$/i;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serverSanitize(html: string): string {
  const placeholders: string[] = [];
  const withPlaceholders = html.replace(
    /<\/?([a-zA-Z0-9]+)\s*\/?>/g,
    (match, tag: string) => {
      if (!SERVER_ALLOWED.test(tag)) return "";
      placeholders.push(match.toLowerCase());
      return `\u0000${placeholders.length - 1}\u0000`;
    },
  );

  return escapeHtml(withPlaceholders).replace(
    /\u0000(\d+)\u0000/g,
    (_m, index: string) => placeholders[Number(index)] ?? "",
  );
}

export function sanitizeHtml(
  html: string,
  config?: Parameters<typeof DOMPurify.sanitize>[1],
): string {
  if (typeof window === "undefined" || typeof DOMPurify.sanitize !== "function") {
    return serverSanitize(html);
  }
  return DOMPurify.sanitize(html, { ...(config ?? {}) }) as unknown as string;
}
