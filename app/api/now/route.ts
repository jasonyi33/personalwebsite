/**
 * /api/now — JSON endpoint consumed by NowApp on the client to surface
 * GitHub's last-commit widget without forcing the whole window into a
 * server-rendered tree. Uses Next.js ISR via the underlying fetch (1h
 * revalidate). Returns `{ commit: null }` when the now.mdx githubUser
 * field is missing or still a bracket placeholder.
 */

import { NextResponse } from 'next/server';
import { getNow } from '@/lib/content';
import { getLatestCommit, type LatestCommit } from '@/lib/github';

export const revalidate = 3600;

export interface NowApiResponse {
  commit: LatestCommit | null;
}

export async function GET(): Promise<NextResponse<NowApiResponse>> {
  const now = getNow();
  const user = now?.githubUser ?? '';
  const commit = await getLatestCommit(user);
  return NextResponse.json({ commit });
}
