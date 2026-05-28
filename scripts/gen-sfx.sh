#!/usr/bin/env bash
#
# Phase 4 — Audio asset generator for NERV-OS.
#
# Synthesises four MP3 files into public/sfx/ using ffmpeg only — no external
# downloads or attribution requirements. Re-run after edits; outputs are
# deterministic so they'll round-trip cleanly through git.
#
# Files produced:
#   boot.mp3    ~1.2s  3 ascending sine bleeps  (440 → 660 → 880 Hz)
#   click.mp3   ~40ms  single 1200 Hz blip
#   close.mp3   ~200ms two descending notes     (660 → 440 Hz)
#   ambient.mp3 ~30s   detuned dual-sine pad through lowpass @ 200 Hz
#
# Requires: ffmpeg binary. Prefers system ffmpeg, otherwise falls back to the
# `ffmpeg-static` npm dependency (installed in node_modules).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$ROOT_DIR/public/sfx"
mkdir -p "$OUT_DIR"

# --- locate ffmpeg ---
if command -v ffmpeg >/dev/null 2>&1; then
  FFMPEG="$(command -v ffmpeg)"
elif [ -x "$ROOT_DIR/node_modules/ffmpeg-static/ffmpeg" ]; then
  FFMPEG="$ROOT_DIR/node_modules/ffmpeg-static/ffmpeg"
else
  # last-ditch: try to install ffmpeg-static on the fly
  echo "ffmpeg not found — installing ffmpeg-static…"
  (cd "$ROOT_DIR" && npm install --no-save ffmpeg-static >/dev/null 2>&1)
  FFMPEG="$ROOT_DIR/node_modules/ffmpeg-static/ffmpeg"
fi
echo "Using ffmpeg: $FFMPEG"

FF=( "$FFMPEG" -hide_banner -loglevel error -y )

# --- boot.mp3 — three ascending sine bleeps, each ~0.35s with decay ---
# Each note is a 0.35s sine multiplied by a quick exponential-style decay
# envelope (afade out). Concat them, then encode.
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for i in 1 2 3; do
  case $i in
    1) FREQ=440 ;;
    2) FREQ=660 ;;
    3) FREQ=880 ;;
  esac
  "${FF[@]}" \
    -f lavfi -i "sine=frequency=${FREQ}:duration=0.35:sample_rate=44100" \
    -af "volume=0.6,afade=t=in:st=0:d=0.01,afade=t=out:st=0.10:d=0.25" \
    -c:a pcm_s16le "$TMP/note_${i}.wav"
done

# concat WAVs then encode to MP3
{ echo "file '$TMP/note_1.wav'"; echo "file '$TMP/note_2.wav'"; echo "file '$TMP/note_3.wav'"; } > "$TMP/list.txt"
"${FF[@]}" -f concat -safe 0 -i "$TMP/list.txt" -c:a libmp3lame -b:a 96k "$OUT_DIR/boot.mp3"

# --- click.mp3 — ~40ms 1200 Hz blip ---
"${FF[@]}" \
  -f lavfi -i "sine=frequency=1200:duration=0.04:sample_rate=44100" \
  -af "volume=0.5,afade=t=in:st=0:d=0.002,afade=t=out:st=0.02:d=0.02" \
  -c:a libmp3lame -b:a 96k "$OUT_DIR/click.mp3"

# --- close.mp3 — two descending notes 660 → 440 Hz, ~200ms total ---
"${FF[@]}" \
  -f lavfi -i "sine=frequency=660:duration=0.10:sample_rate=44100" \
  -af "volume=0.5,afade=t=out:st=0.05:d=0.05" \
  -c:a pcm_s16le "$TMP/c1.wav"
"${FF[@]}" \
  -f lavfi -i "sine=frequency=440:duration=0.10:sample_rate=44100" \
  -af "volume=0.5,afade=t=out:st=0.04:d=0.06" \
  -c:a pcm_s16le "$TMP/c2.wav"
{ echo "file '$TMP/c1.wav'"; echo "file '$TMP/c2.wav'"; } > "$TMP/clist.txt"
"${FF[@]}" -f concat -safe 0 -i "$TMP/clist.txt" -c:a libmp3lame -b:a 96k "$OUT_DIR/close.mp3"

# --- ambient.mp3 — 30s pad, two detuned sines mixed and lowpass-filtered ---
# 110 Hz + 110.7 Hz (detuned) → amerge → lowpass 200 → low gain (~-28 dBFS).
# Encoded at low bitrate to stay under 500 KB.
"${FF[@]}" \
  -f lavfi -i "sine=frequency=110:duration=30:sample_rate=44100" \
  -f lavfi -i "sine=frequency=110.7:duration=30:sample_rate=44100" \
  -filter_complex "[0:a][1:a]amix=inputs=2:duration=longest:dropout_transition=0,lowpass=f=200,volume=0.06,afade=t=in:st=0:d=1.5,afade=t=out:st=28.5:d=1.5" \
  -ac 1 -c:a libmp3lame -b:a 48k "$OUT_DIR/ambient.mp3"

echo ""
echo "Generated files:"
ls -lh "$OUT_DIR"/*.mp3
