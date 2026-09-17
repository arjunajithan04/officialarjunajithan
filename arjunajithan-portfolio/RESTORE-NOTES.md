# Portfolio UI Restore

This package restores the last known-good visual direction before the Project Case Study experiment.

Restored:
- Dark Hero with `public/images/hero-portrait.jpg`
- Original polished Projects preview experience with Supabase project image support
- Experience career timeline with rail, nodes, active chapter states, and existing modal/CMS flow
- ARJUN.OS keyboard Easter egg (`A`) and existing section transition layer

Preserved:
- Supabase CMS/admin modules
- Project image picker / `project-images` Storage integration
- Existing navigation, About, Capabilities, Contact, cursor and scroll systems
- Vercel SPA rewrite

The case-study-specific `case_study` frontend is intentionally not included in this restore because it was the source of the unwanted Projects UI regression. The database column can remain in Supabase harmlessly.

Run locally:

```bash
npm install
npm run build
```
