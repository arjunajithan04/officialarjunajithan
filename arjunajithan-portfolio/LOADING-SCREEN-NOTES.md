# Cinematic Loading Screen

This iteration keeps the restored portfolio UI untouched and adds a cinematic refresh loader.

## Changed
- `src/components/LoadingScreen.tsx`
- `src/App.tsx` (mounts the loader on public routes)
- `src/index.css` (loader-only CSS appended after the existing stylesheet)
- `public/images/portfolio-loader-bg.png` (latest approved artwork)

## Behavior
- Appears on every public-page refresh.
- Does not appear on `/admin` or `/admin/login`.
- 0–100% progress animation over ~6 seconds, giving the viewer enough time to take in the cinematic scene before entering the portfolio.
- Mouse-reactive image parallax.
- Animated blue/red ambient glow layers.
- Grain, scanline, and light-sweep overlays.
- Smooth fade/scale exit into the existing portfolio.
- Respects `prefers-reduced-motion`.
