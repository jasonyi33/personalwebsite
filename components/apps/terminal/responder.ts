/**
 * Thin re-export so TerminalChat can import a colocated module name
 * (`./responder`) while the canonical implementation lives in
 * `lib/personality.ts`. Keeps the spec's file layout intact without
 * duplicating logic.
 */

export { respond } from '@/lib/personality';
export type { NervReply } from '@/lib/personality';
