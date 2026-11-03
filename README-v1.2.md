# Desktop Cat v1.2 — gait and purr iteration

## Improvements
- 12 new artwork-preserving walk frames for Mochi, Luna and Cocoa.
- Each paw region receives a different phase of the gait cycle. An additional
  shaded far-side paw is visible below the torso to reduce the frozen-leg look.
- Preserves the original face, colouring, tail, ball-catching art and transparent windows.
- Replaced the previous 64 Hz triangle-wave oscillator with an offline-generated
  textured/breath-shaped WAV asset. The player fades by stopping at the duration.
- Cat size and ball size remain synchronized from v1.1.

## Important limitations
- This is still a raster sprite cycle, NOT a fully skeletal/IK rig. Genuine
  articulated movement and foot locking need newly illustrated separated
  body and four leg layers. The included `v12_walk_preview.png` shows the
  actual new sprites rather than a concept image.
- The bundled purr is synthesized, NOT a recording of a real cat. For an
  authentic purr, replace `src/assets/purr.wav` with a properly licensed
  real cat recording. Public-domain example: Wikimedia Commons
  `Whiskers' purr.ogg` by Adam Cuerden. Update the import in App.tsx.
- Mac-native Rust compilation and audio output could not be tested here.

## Run
```
npm install
npm run tauri dev
```
