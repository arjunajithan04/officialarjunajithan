# UI-Only Loader Variant

This variant removes the ARJUN/AJITHAN name treatment from the preloader and replaces it with a pure interface-driven loading experience.

## Preserved
- Existing `src/components/LoadingScreen.tsx` remains untouched as the previous loader baseline.
- Existing portfolio sections, Hero, Projects, Experience timeline, About, Contact, navigation and CMS remain untouched.
- Admin routes do not render the public loader.

## Active loader
- `src/components/LoadingScreenUI.tsx`
- `src/components/loading-screen-ui.css`

## Timing
- Total: 6000ms
- Exit begins: 5250ms
- Final reveal completes: 6000ms

## Visual system
- Architectural grid
- ARJUN.OS status indicator
- System profile panel
- Live signal bars
- Rotating circular system core
- Stage/process module
- Diagnostics module
- Discipline cycling
- Progress bar and compact percentage
- Scanline/grain
- UI-only exit choreography
