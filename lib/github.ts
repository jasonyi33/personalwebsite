/**
 * GitHub last-commit fetcher for NOW.feed (spec 5.4).
 *
 * Uses the unauthenticated public events endpoint and walks recent events to
 * find the most recent PushEvent. Cached via Next.js fetch ISR (1h) so the
 * route handler is cheap on subsequent requests. Returns null on any error —
 * never throws — so the UI can simply omit the LAST COMMIT section.
 */

export interface LatestCommit {
  sha: string;
  message: string;
  date: string;
  url: string;
  repo: string;
}

interface PushEventCommit {
  sha: string;
  message: string;
  url: string;
}

interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: { commits?: PushEventCommit[] };
}

function isBracketPlaceholder(user: string): boolean {
  return /^\[.*\]$/.test(user.trim());
}

export async function getLatestCommit(
  user: string,
): Promise<LatestCommit | null> {
  if (!user || isBracketPlaceholder(user)) return null;

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}/events/public`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return null;

    const events = (await res.json()) as GitHubEvent[];
    if (!Array.isArray(events)) return null;

    const push = events.find(
      (e) =>
        e.type === 'PushEvent' &&
        Array.isArray(e.payload.commits) &&
        e.payload.commits.length > 0,
    );
    if (!push || !push.payload.commits || push.payload.commits.length === 0) {
      return null;
    }

    // Latest commit in a push is the last one in the array.
    const head = push.payload.commits[push.payload.commits.length - 1];
    const repo = push.repo.name;

    return {
      sha: head.sha,
      message: head.message.split('\n')[0],
      date: push.created_at,
      url: `https://github.com/${repo}/commit/${head.sha}`,
      repo,
    };
  } catch {
    return null;
  }
}
