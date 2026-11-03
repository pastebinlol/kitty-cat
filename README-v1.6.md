# Desktop Cat v1.6 — Windows overlay fixes

- Added a persistent Show yarn ball switch in the Interactions panel.
- Added a Hide yarn ball / Show yarn ball button on Cat and Settings screens.
- Prevented the catch animation from showing the ball again after the user hid it.
- Raised the yarn ball above the transparent pet overlay when it is shown.
  This addresses the invisible pet-window rectangle intercepting drag input.
- Added a window-level pointer-up fallback for interrupted ball drags.
- Disabled GPU-composited CSS drop shadows during catch/play animation to
  reduce rectangular artifacts in Windows WebView2 transparent overlays.
- Kept the v1.5 cat artwork, gait and catching frames unchanged.

Build with GitHub Actions > Build Windows installer. The included
Windows icon and workflow are retained. This environment cannot run the
Windows executable, so these are source-level fixes and need runtime testing.

If the rectangular artifact persists, send a screenshot of it; it may be
WebView2 transparency rather than a sprite/CSS issue.
