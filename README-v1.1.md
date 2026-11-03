# Desktop Cat v1.1 — matched ball sizing and four-leg gait

## Changes
- The yarn ball window now follows the exact same Cat size slider value as the pet.
- The new `resize_ball` Rust command resizes the native ball window, preserving its center.
- The Ball React window listens to the same settings event as the pet.
- All 24 walk-step PNGs (8 each for Mochi, Luna and Cocoa) have been regenerated
  with localized alternating movement of front and rear, near and far legs.
- Walking frames advance every 85 ms (previously 105 ms) to better align
  step timing with the native 250 px/s chase movement.
- Existing play animation, sleep transitions, purring and ball-matching art retained.

## Run
```bash
npm install
npm run tauri dev
```

## Limitations
The walking animation now moves four leg zones out of phase, but the art is
still based on the existing raster illustration, not a skeletal 3D animation
rig. Some occluded legs cannot be independently revealed without new art.
The archive and assets were validated, but this environment cannot compile
or run the native macOS app. Please report compiler/runtime errors.
