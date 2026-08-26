#!/bin/bash
# Processes assets/ (masters) into public/ (web derivatives).
# Uses macOS built-ins only: afconvert (audio), sips (images), avconvert (video).
set -euo pipefail
cd "$(dirname "$0")/.."

AUDIO_OUT="public/audio"
BRAIN_OUT="public/brain"
BAND_OUT="public/band"
TECH_OUT="public/musictech"
mkdir -p "$AUDIO_OUT" "$BRAIN_OUT" "$BAND_OUT" "$TECH_OUT"

wav_to_m4a() { # src dst
  echo "audio: $1 -> $2"
  afconvert -f m4af -d aac -b 192000 "$1" "$2"
}

# --- Playlist audio ---
wav_to_m4a "assets/playlist/zar(game soundtrack).wav"            "$AUDIO_OUT/zar.m4a"
wav_to_m4a "assets/playlist/shootingspree(game soundtrack).wav"  "$AUDIO_OUT/shootingspree.m4a"
wav_to_m4a "assets/playlist/playingwiththeBuchla.wav"            "$AUDIO_OUT/playing-with-the-buchla.m4a"
wav_to_m4a "assets/playlist/beatbattle(all sounds were made out of a default piano).wav" "$AUDIO_OUT/beatbattle.m4a"
wav_to_m4a "assets/playlist/crazybass.wav"                       "$AUDIO_OUT/crazybass.m4a"
wav_to_m4a "assets/playlist/battle against a cute child.wav"     "$AUDIO_OUT/battle-against-a-cute-child.m4a"
wav_to_m4a "assets/playlist/please do not lean.wav"              "$AUDIO_OUT/please-do-not-lean.m4a"
wav_to_m4a "assets/playlist/NothingFarm.wav"                     "$AUDIO_OUT/nothing-farm.m4a"
wav_to_m4a "assets/playlist/underscore.wav"                      "$AUDIO_OUT/underscore.m4a"
cp "assets/playlist/I3DPrintedThisHorn.mp3"                      "$AUDIO_OUT/i-3d-printed-this-horn.mp3"
cp "assets/playlist/RolandAndMarianneInTheBallroom(collab with a friend).m4a" "$AUDIO_OUT/roland-and-marianne.m4a"
cp "assets/playlist/Constellations_Ambient_Final.m4a"            "$AUDIO_OUT/constellations.m4a"

# --- Brain MRI frames (small PNGs, copy as-is) ---
for dir in assets/brain/brain*/; do
  name=$(basename "$dir")
  mkdir -p "$BRAIN_OUT/$name"
  cp "$dir"*.png "$BRAIN_OUT/$name/"
done

# --- Band assets ---
sips -s format jpeg --resampleHeightWidthMax 1600 "assets/i_m in a band/IMG_2404.HEIC" --out "$BAND_OUT/IMG_2404.jpg" >/dev/null
sips -s format jpeg --resampleHeightWidthMax 1600 "assets/i_m in a band/IMG_2408.HEIC" --out "$BAND_OUT/IMG_2408.jpg" >/dev/null
sips -s format jpeg --resampleHeightWidthMax 1600 "assets/i_m in a band/20240407-606A2122.jpeg" --out "$BAND_OUT/20240407-606A2122.jpg" >/dev/null
cp "assets/i_m in a band/boomboomsauce.mp4" "$BAND_OUT/boomboomsauce.mp4"

# --- Music tech videos ---
cp "assets/music tech/ControllingMusicWithACustomBuiltBrainSensor.mp4" "$TECH_OUT/ControllingMusicWithACustomBuiltBrainSensor.mp4"
cp "assets/music tech/PlayingWithTheBuchla.mp4" "$TECH_OUT/PlayingWithTheBuchla.mp4"
# Large masters: transcode to 720p H.264 (needs ffmpeg: brew install ffmpeg)
for big in "IBuiltASynthsizerCalledChippy" "CodingMusicInMySubaru"; do
  if [ ! -f "$TECH_OUT/$big.mp4" ]; then
    echo "video: transcoding $big (this can take a minute)..."
    ffmpeg -y -i "assets/music tech/$big.mp4" \
      -c:v libx264 -crf 26 -preset medium -vf "scale='min(1280,iw)':-2" \
      -c:a aac -b:a 128k -movflags +faststart \
      "$TECH_OUT/$big.mp4" -loglevel error
  fi
done

echo "--- durations ---"
for f in "$AUDIO_OUT"/*; do
  d=$(afinfo "$f" | awk '/estimated duration/ {print $3}')
  echo "$(basename "$f"): ${d}s"
done
echo "--- sizes ---"
du -sh "$AUDIO_OUT" "$BRAIN_OUT" "$BAND_OUT" "$TECH_OUT"
echo "Done."
