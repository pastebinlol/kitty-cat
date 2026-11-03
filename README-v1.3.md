# Desktop Cat v1.3 — Crossing front paws

The two front legs are now rendered as independent layers above the torso, with their feet crossing paths in alternating phases. Both legs move; the draw order swaps at half stride to show the near paw passing in front of the far paw. The rear legs keep an offset gait. The other animations, cat art, ball scaling and purr are unchanged.

Run: `npm install && npm run tauri dev`.

The walk is a layered 2D reconstruction from existing artwork, not a hand-illustrated frame-by-frame animation. Native macOS runtime was not tested.
