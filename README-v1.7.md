# Desktop Cat v1.7 — Fullscreen click-through

Based on v1.6 fixes WITH the purring audio removed.

New Settings > Interactions option: **Fullscreen overlay (click-through)**.
When enabled, the native `pet` and `ball` overlay windows ignore mouse input
using Tauri `set_ignore_cursor_events(true)`. Your game receives the clicks
instead. When disabled, petting and ball dragging work normally.

IMPORTANT: This is a MANUAL MODE, not automatic fullscreen detection.
While enabled, both overlays are click-through even on the normal desktop.
Use the dashboard (which remains clickable) to turn it off.

Windows rebuild:
  git add .
  git commit -m "Add fullscreen click-through mode"
  git push origin main
Then run the Windows installer workflow on GitHub Actions.

Native Windows compilation/runtime is not verified in this environment.
