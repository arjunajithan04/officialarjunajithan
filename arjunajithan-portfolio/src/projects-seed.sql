-- Optional seed: adds the three projects already represented in the portfolio.
-- Run this once in Supabase SQL Editor if the projects table is empty.

insert into public.projects
  (title, description, year, technologies, project_type, github_url, sort_order)
values
  (
    'E-COMMERCE CATEGORY TREE MANAGER',
    'A web-based e-commerce category management project focused on organizing and managing hierarchical product categories.',
    2026,
    'HTML · CSS · JAVASCRIPT',
    'WEB',
    'https://github.com/ashfaqhyder/Mini-Project-E-Commerce-Category-Tree-Manager-Using-Flask',
    0
  ),
  (
    'TAXSMART TAX-SAVING INFORMATION PORTAL',
    'A tax-saving information portal designed to make tax-related information easier to explore and understand.',
    2025,
    'WEB TECHNOLOGIES',
    'WEB',
    'https://github.com/arjunajithan04/TaxSmart',
    1
  ),
  (
    'DULE OFFLINE & ONLINE MESSAGING',
    'A messaging project exploring communication across offline and online contexts using Bluetooth Low Energy and web technologies.',
    2024,
    'BLE · WEB TECHNOLOGIES',
    'MESSAGING',
    'https://github.com/balajidnz/DULE',
    2
  );
