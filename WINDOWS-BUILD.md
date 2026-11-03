# Build Desktop Cat for Windows

This source bundle includes a GitHub Actions workflow to build the native Windows installer on a Windows runner. **The ZIP is source code, not an executable.**

## Without installing development tools

1. Create a GitHub repository and upload the **contents** of this folder, including `.github/workflows/windows-build.yml`.
2. Open the repository's **Actions** tab.
3. Choose **Build Windows installer**, then **Run workflow**.
4. When it completes, open the run and download the `desktop-cat-windows-installer` artifact.
5. Unzip the artifact and run the included `.exe` installer on Windows.

## Build on a Windows computer

Install Node.js 22, Rust (MSVC), Microsoft C++ Build Tools and WebView2 as described in the official Tauri prerequisites. Then in this folder run:

```powershell
npm install
npm run tauri -- build --bundles nsis
```

The resulting installer should appear under `src-tauri\target\release\bundle\nsis\`.

## Important

This project was originally designed for macOS. Its use of window positioning, transparency and always-on-top behavior has **not** been validated on Windows. The GitHub Actions build itself has not been executed here, and may expose code issues requiring fixes. Windows SmartScreen may warn about unsigned installers.
