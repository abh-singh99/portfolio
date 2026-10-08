#!/usr/bin/env bash
# Turn a raw recording into a web-ready project clip.
#
#   scripts/process-video.sh <input> <slug> <phone|browser> [start] [duration]
#
# Writes public/videos/<slug>.mp4 (H.264, muted, faststart) and
# public/videos/<slug>.jpg (poster from the first frame).
#   phone   -> 720px wide (portrait app recordings)
#   browser -> 1440px wide (desktop screen recordings)
# start/duration trim the clip, e.g. 00:00:03 18
set -euo pipefail

FFMPEG="${FFMPEG:-$(command -v ffmpeg || echo "$HOME/.local/bin/ffmpeg")}"
in="${1:?input file}"; slug="${2:?slug, e.g. yeapp}"; frame="${3:?phone or browser}"
start="${4:-0}"; dur="${5:-}"
out_dir="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
mkdir -p "$out_dir"

case "$frame" in
  phone) width=720 ;;
  browser) width=1440 ;;
  *) echo "frame must be phone or browser" >&2; exit 1 ;;
esac

trim=(-ss "$start")
[ -n "$dur" ] && trim+=(-t "$dur")

# Even dimensions are required by H.264; -2 keeps the aspect ratio.
"$FFMPEG" -hide_banner -loglevel error -y "${trim[@]}" -i "$in" \
  -an -vf "scale=${width}:-2:flags=lanczos,fps=30" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart \
  "$out_dir/$slug.mp4"

"$FFMPEG" -hide_banner -loglevel error -y -i "$out_dir/$slug.mp4" \
  -frames:v 1 -q:v 3 "$out_dir/$slug.jpg"

size=$(du -h "$out_dir/$slug.mp4" | cut -f1)
echo "public/videos/$slug.mp4 ($size) and public/videos/$slug.jpg"
