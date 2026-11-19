# Etsy reviews

Four reviews were supplied by the owner as Etsy screenshots on 5 November 2026. Their original wording, display names, dates and five-star ratings are recorded in `src/data/community-content.json`. Screenshots are retained as evidence under `docs/sources/etsy-reviews/`; they are not included in the public asset directory or embedded on the page.

| Reviewer | Review date    | Visible purchase context                           | Evidence file          |
| -------- | -------------- | -------------------------------------------------- | ---------------------- |
| Shannon  | 17 June 2026   | 300x Ultimate Cybersigilism Pack                   | shannon-2026-06-17.png |
| Edie     | 1 August 2026  | 300x Ultimate Cybersigilism Pack                   | edie-2026-08-01.png    |
| Steven   | 10 August 2026 | 110x Dark Art Tattoo Flash pack                    | steven-2026-08-10.png  |
| Tae      | 31 July 2026   | 121-design collection (confirmed 19 November 2026) | tae-2026-07-31.png     |

The 110-design listing is now its own product (`110`), separate from the 121-design collection. Tae's review belongs to the 121-design listing. Purchase context is retained in the data; the home cards show the quote, rating, name, Etsy source and date.

No review or shop URLs were present in the screenshots, so there are no invented review links. Add a confirmed HTTPS `sourceUrl` to the relevant item to enable its link. Every item requires either a source URL or a screenshot reference. The selected reviews do not define a shop-wide average or aggregate rating.

The shared `Reviews.astro` component renders the home section. Four cards appear in one row on large screens, two columns on tablets and one column on phones. Social profile data is maintained separately in the same JSON file.

## Product ratings and selected reviews (19 November 2026)

The owner filled in a content questionnaire and supplied one screenshot of the Etsy reviews for each of the eight listings. Each product file in `src/content/products/` now holds the Etsy summary (`rating`: average, count, `checkedOn: 2026-11-19`) and two to four selected reviews copied verbatim, spelling included. The screenshots are kept in `docs/sources/etsy-reviews/2026-11-19/listing-<id>.png`.

| Product | Etsy rating | Reviews quoted                     |
| ------- | ----------- | ---------------------------------- |
| 100     | 5.0 (12)    | Salem, Jarren, OldSkoolTees        |
| 121     | 4.8 (4)     | Jetaime, Tae, Bernadine            |
| 300     | 5.0 (4)     | Matilda, Etsy buyer, Edie, Shannon |
| 200     | 5.0 (1)     | A                                  |
| 55      | 5.0 (2)     | Salem, Kastlera                    |
| 25      | 5.0 (2)     | Jessica, Tara                      |
| 110     | 5.0 (3)     | Steven, Jamie, A                   |
| 54      | 5.0 (2)     | Jamie, A                           |

The rating averages come from Etsy and include every review, not only the quoted ones. A German review on 100 (Nilo) and a four-star review on 121 (Jes) were not quoted. The 100 screenshot shows four of the twelve reviews; Salem's review appears on both 100 and 55, which suggests one buyer purchased both listings.
