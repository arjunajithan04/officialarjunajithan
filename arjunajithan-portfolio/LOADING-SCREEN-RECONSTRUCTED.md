# Reconstructed Interactive Loading Screen

The cinematic loading screen is now rebuilt as independent UI rather than using the generated poster as its primary visual layer.

## Components
- Animated blue and red SVG energy streams
- Interactive mouse-parallax title and scene layers
- SVG mountain ranges with animated mist
- CSS-built rocky foreground/island
- CSS-built seated silhouette with hover response
- Actual SVG `ARJUN` typography with mountain pattern fill
- `AJITHAN`, editorial copy, corner metadata and status UI as DOM elements
- Animated perspective grid
- Film grain, scanlines, vignette and light sweep as independent layers
- Live 0–100 progress animation
- ARJUN.OS online indicator

## Timing
- 6 second cinematic sequence
- 650ms exit transition

## Accessibility
- `role="status"`
- Reduced-motion media query support
- Decorative SVG layers marked `aria-hidden`

## Asset policy
The previously generated poster image is intentionally NOT used by the loading screen and has been removed from `public/images` in this version.
