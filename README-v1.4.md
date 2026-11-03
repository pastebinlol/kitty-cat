# Desktop Cat v1.4 — original look and stable sleep pose

- Restores the original illustrated cat appearance during walking, replacing
  the mismatched, simplified v1.3 crossing-leg drawings with the 12-frame
  original-art-based v1.2 rig cycle.
- Stops switching between `sleep` and `nap` images, which are drawn from
  different orientations and created the apparent 180-degree flip.
- Keeps left/right mirroring limited to the walking pose.
- Keeps the catching animation, ball sizing, purring, sleep transitions.

The v1.3 exaggerated crossing-leg effect has been reverted to preserve the
cat's appearance. A true crossing-leg animation matching the original art
requires new consistent artwork or an articulated 2D rig.

Run: npm install && npm run tauri dev

Native macOS build and runtime not tested in this environment.
