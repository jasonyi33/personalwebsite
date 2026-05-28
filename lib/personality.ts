/**
 * JASON persona responder (spec 5.5, rebranded from NERV).
 *
 * A small client-side keyword router. Returns either a plain string reply or
 * a `{ openApp, reply }` directive that the caller will dispatch through the
 * OS store. No external LLM — everything is canned, in-character (sardonic
 * intern), and free of side-effects.
 */

import type { AppId } from './apps';

export type NervReply = string | { openApp: AppId; reply: string };

const FALLBACKS: readonly string[] = [
  "no pattern match. ask about projects, logs, now, or about — anything else and i'm guessing.",
  "i'd love to help but i don't know what that means. try 'help'.",
  "i'm an intern, not a search engine. try 'projects', 'logs', 'now', or 'about'.",
  "input filed under 'unclear'. type 'help' for the actual menu.",
];

const GREETINGS: readonly string[] = [
  'greetings, visitor. you are exactly where you think you are.',
  "you're in. try not to break anything important.",
  "ah. another one. welcome.",
];

const WHO_AM_I =
  "i'm JASON — technically a chatbot, functionally a sardonic intern jason left to mind the site. ask about projects, logs, or what he's working on now.";

const HOW_ARE_YOU =
  "uptime is good, salary is zero, vibes are stable. ask me something useful.";

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function matches(t: string, needles: readonly string[]): boolean {
  return needles.some((n) => t.includes(n));
}

export function respond(input: string): NervReply {
  const t = input.trim().toLowerCase();

  if (t.length === 0) {
    return 'awaiting input.';
  }

  if (t === 'help') {
    return "menu: ask about jason ('who is jason'), browse 'projects', read 'logs', see what he's doing 'now'. hidden: theme cyan|red|amber, clear.";
  }

  if (matches(t, ['hello', 'hi ', 'hi!', 'hi?', 'hey', 'yo ', 'greetings']) || t === 'hi' || t === 'hey') {
    return pick(GREETINGS);
  }

  if (matches(t, ['who are you', 'what are you', 'who r u', 'tell me about yourself', 'about yourself'])) {
    return WHO_AM_I;
  }

  if (matches(t, ['who is jason', 'who is he', 'about jason', 'tell me about jason'])) {
    return { openApp: 'about', reply: 'opening profile. spoiler: he likes shipping things.' };
  }

  if (matches(t, ['projects', 'work', 'portfolio', 'archive'])) {
    return { openApp: 'projects', reply: 'pulling the project archive. four entries, varying degrees of "is this still alive".' };
  }

  if (matches(t, ['blog', 'logs', 'posts', 'writing'])) {
    return { openApp: 'blog', reply: 'opening logs. there is, in fact, one entry.' };
  }

  if (matches(t, ['contact', 'about', 'who is', 'profile', 'bio'])) {
    return { openApp: 'about', reply: 'profile incoming.' };
  }

  if (matches(t, ['now', 'status', 'currently', 'what is he doing'])) {
    return { openApp: 'now', reply: 'pulling current status — short answer: heads down on leadrin.' };
  }

  if (matches(t, ['how are you', 'how r u', "how's it", 'how do you feel'])) {
    return HOW_ARE_YOU;
  }

  if (matches(t, ['thanks', 'thank you', 'ty'])) {
    return 'noted. add it to my performance review.';
  }

  if (matches(t, ['bye', 'goodbye', 'see you', 'cya'])) {
    return 'channel closing. tell jason i did good.';
  }

  return pick(FALLBACKS);
}
