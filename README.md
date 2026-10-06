# Atlantic Express public website

Official marketing website for https://atlxpres.com, operated by Atlantic Shansu Logistics Limited.

Deploy this repository as a static site, with both the base and publish directories set to `/`. Include the `assets` directory. No API credentials, environment variables, or build step are required. `node server.js` serves a local preview on port 5173; `/health` is available when using that server.

The five supplied images are encoded as WebP without cropping. Desktop hero text sits on the pale left side, and provider copy on the pale right side. At widths up to 800px, hero text precedes its image and provider copy follows its image. Category images retain their full 4:3 compositions, with copy below. Property artwork is explicitly described as promotional, rather than an available listing.

Contact: support@atlxpres.com and +234 706 050 7214. Provider links open https://provider.atlxpres.com. Customer category links explain mobile app availability; replace that launch section with verified public store links when the apps are published. Internal EAS builds are not public downloads.

Validation: headless Chrome at 320, 390, 768, 820, 1024 and 1440 CSS pixels, checking image loading, horizontal overflow, and hero/provider stacking. Storage upload regression tests belong to the separate provider portal repository.
