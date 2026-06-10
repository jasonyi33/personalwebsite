const FONT_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&display=swap';

async function fetchFont(): Promise<ArrayBuffer> {
  // No User-Agent header: Google Fonts then returns a TTF URL (woff2 only when UA
  // signals modern browser). Satori (used by @vercel/og) requires TTF or OTF.
  const css = await fetch(FONT_CSS_URL).then((r) => r.text());
  const match = css.match(/url\((https:\/\/[^)]+\.ttf)\)/);
  if (!match) throw new Error('Space Grotesk TTF URL not found in Google Fonts CSS');
  return fetch(match[1]).then((r) => r.arrayBuffer());
}

let cached: Promise<ArrayBuffer> | undefined;

export function loadSpaceGroteskMedium(): Promise<ArrayBuffer> {
  cached ??= fetchFont();
  return cached;
}
