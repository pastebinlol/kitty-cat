# Desktop Cat v1.0 — softer transitions, longer naps and purring

## Fixed
- Rust `E0600`: `-(size.width as f64)` instead of `-size.width as f64`.
- Restored v0.9's matching ball and eight walking-step frames.

## Behaviour
- Sit -> lie-down -> sleep and sleep -> wake-up -> sit now use a 1.1-second
  eased posture blend with vertical lowering/rising rather than a single-frame swap.
- Sleeping is more frequent (especially Relaxed personality), lasts about
  17–32 seconds, and includes subtle breathing.
- Click the cat to pet it and hear a soft synthesized purr (no audio file required).
- Purring during ball play is enabled once a click has unlocked Web Audio.
- The ball and cat windows stay transparent.

## Run
```bash
npm install
npm run tauri dev
```

## Technical notes
- macOS WebKit may block sound until the first user click. Click the cat to
  unlock purring; adjust macOS output volume as needed.
- The transition blends existing sitting and sleeping art with scale/translation.
  It is smoother, but NOT a newly hand-drawn anatomical crouch-to-curl sequence.
  A truly lifelike transition requires new in-between illustrated frames.
- I verified TypeScript syntax and the ZIP; native Rust/macOS compilation
  and runtime behaviour could not be tested in this environment.
