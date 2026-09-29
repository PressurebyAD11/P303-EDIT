const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY as string | undefined;
const CACHE_PREFIX = "edit:img:";

if (import.meta.env.DEV) {
  console.log(
    ACCESS_KEY
      ? `[EDIT] Unsplash: key loaded (${ACCESS_KEY.slice(0, 6)}…)`
      : "[EDIT] Unsplash: no key — add VITE_UNSPLASH_ACCESS_KEY to .env.local",
  );
}

interface UnsplashSearchResult {
  results: Array<{
    urls: { small: string; regular: string };
    user: { name: string; links: { html: string } };
    links: { download_location: string };
  }>;
}

export function getCachedImage(itemId: string): string | null {
  try {
    return localStorage.getItem(CACHE_PREFIX + itemId);
  } catch {
    return null;
  }
}

export function clearImageCache(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}

export async function fetchItemImage(
  itemId: string,
  query: string,
): Promise<string | null> {
  if (!ACCESS_KEY) return null;

  const cached = getCachedImage(itemId);
  if (cached) return cached;

  const productQuery = `${query} clothing product flat lay`;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(productQuery)}&per_page=1&orientation=squarish&content_filter=high`,
      { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } },
    );

    if (res.status === 401) {
      console.warn("[EDIT] Unsplash: invalid API key — check VITE_UNSPLASH_ACCESS_KEY");
      return null;
    }
    if (res.status === 403) {
      console.warn("[EDIT] Unsplash: rate limit reached");
      return null;
    }
    if (!res.ok) return null;

    const data: UnsplashSearchResult = await res.json();
    const url = data.results?.[0]?.urls?.small ?? null;

    if (url) {
      try {
        localStorage.setItem(CACHE_PREFIX + itemId, url);
      } catch {
        // localStorage full — skip caching
      }
    }

    return url;
  } catch {
    return null;
  }
}
