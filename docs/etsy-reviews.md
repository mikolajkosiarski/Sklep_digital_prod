# Etsy reviews

Four reviews were supplied by the owner as Etsy screenshots on 5 November 2026. Their original wording, display names, dates and five-star ratings are recorded in `src/data/community-content.json`. Screenshots are retained as evidence under `docs/sources/etsy-reviews/`; they are not included in the public asset directory or embedded on the page.

| Reviewer | Review date    | Visible purchase context               | Evidence file          |
| -------- | -------------- | -------------------------------------- | ---------------------- |
| Shannon  | 17 June 2026   | 300x Ultimate Cybersigilism Pack       | shannon-2026-06-17.png |
| Edie     | 1 August 2026  | 300x Ultimate Cybersigilism Pack       | edie-2026-08-01.png    |
| Steven   | 10 August 2026 | 110x Dark Art Tattoo Flash pack        | steven-2026-08-10.png  |
| Tae      | 31 July 2026   | Not visible in the supplied screenshot | tae-2026-07-31.png     |

The 110-design listing must not be attributed to the current 121-design product. Tae's product is unknown. Purchase context is retained in the data; the home cards show the quote, rating, name, Etsy source and date.

No review or shop URLs were present in the screenshots, so there are no invented review links. Add a confirmed HTTPS `sourceUrl` to the relevant item to enable its link. Every item requires either a source URL or a screenshot reference. The selected reviews do not define a shop-wide average or aggregate rating.

The shared `Reviews.astro` component renders the home section. Four cards appear in one row on large screens, two columns on tablets and one column on phones. Social profile data is maintained separately in the same JSON file.
