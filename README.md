# evemos-site

The marketing website of [Evemos](https://evemos.events), event software I'm building. The website and the app share one Next.js project in a private repo. This repo holds only the website part:

- `src/app/(site)/`: the routes and pages
- `src/site/`: components, page content, styles, photos and their tests
- `src/lib/product.ts`, `src/lib/site-config.ts` and `src/brand/`: the product data and design tokens the pages read

It's a read-only sample with a fresh history. Some imports point into the rest of the app (forms, sign-in, the app's own screens), and those files aren't here, so it doesn't build on its own. The tests are Vitest files next to the code they cover.
