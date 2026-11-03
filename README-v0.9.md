# Desktop Cat v0.9 — Restored play animation and visible leg steps

This version starts from **v0.7**, specifically to restore the original, preferred
catch/roll interaction rather than the v0.8 sitting-with-ball replacement.

## Changes
- Original catch and roll poses are restored for Mochi, Luna and Cocoa.
- The mismatched yarn inside those poses has been replaced with the same
  cream illustrated `ball-0.png` used in the draggable ball window.
- The ball window is 90 × 90 physical/logical units in Tauri's configuration;
  its rendered yarn diameter is approximately 70 px at normal scaling,
  comparable to the yarn shown in the cat's play pose.
- Eight walk-step frames per cat now deform the front and rear paws in
  alternating directions, instead of only wobbling the entire body.
- The cat faces left or right based on the ball's screen position.
- Native movement is constant-speed and stops beside the ball.
- The separate ball is hidden during play and restored afterward.

## Run
```bash
npm install
npm run tauri dev
```

## Limitations
The new step frames are derived from the existing side-view illustrations with
localized leg deformation. This is more leg movement than v0.8, but it is not
hand-drawn skeletal animation with independent articulated limbs.
The play/roll yarn overlays are composited into the existing art, so minor
edge differences may still be visible around the cat's paws.
I validated the TypeScript syntax and the included PNG files; I could not
complete npm dependency installation or test a macOS Tauri GUI here.
