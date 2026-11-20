# Lighthouse i Schema.org — 20 listopada 2026

## Lighthouse

Lighthouse 13.6.0 (Chromium 153, tryb headless) badał produkcyjny build z `BASE_PATH=/Sklep_digital_prod`, czyli te same pliki, które publikuje GitHub Pages. Pliki były serwowane lokalnie z kompresją gzip. Telefon to domyślne ustawienia Lighthouse: Moto G Power i symulowane wolne 4G. Komputer to preset `desktop`.

Pełne raporty HTML są w [`docs/lighthouse/2026-11-20/`](lighthouse/2026-11-20/); otwórz plik w przeglądarce.

Wyniki: wydajność / dostępność / dobre praktyki / SEO.

| Strona (instrukcja CW5)                     | Telefon                  | Komputer              |
| ------------------------------------------- | ------------------------ | --------------------- |
| Strona główna `/` (`index.html`)            | **86** / 100 / 100 / 100 | 99 / 100 / 100 / 100  |
| Sklep `/shop/` (`sklep.html`)               | **90** / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Produkt `/shop/110/` (`produkt.html`)       | **94** / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Koszyk `/cart/` (`koszyk.html`)             | 100 / 100 / 100 / 66     | 100 / 100 / 100 / 66  |
| Zamówienie `/checkout/` (`zamowienie.html`) | 100 / 100 / 100 / 66     | 100 / 100 / 100 / 66  |
| Konto `/account/` (`konto.html`)            | 100 / 100 / 100 / 66     | 100 / 100 / 100 / 66  |
| Journal `/journal/`                         | 100 / 100 / 100 / 100    | 100 / 100 / 100 / 100 |
| Artykuł `/journal/png-or-brushset/`         | 100 / 100 / 100 / 100    | 100 / 100 / 100 / 100 |
| Kontakt `/contact/`                         | 100 / 100 / 100 / 66     | 100 / 100 / 100 / 66  |

Wydajność na telefonie dla strony głównej, sklepu i produktu to mediana z pięciu pomiarów (główna 83–88, sklep 89–91, produkt 94–96). Raport HTML pokazuje jeden z tych pomiarów, więc jego wynik może się różnić o kilka punktów.

### Jak czytać wyniki

- **SEO 66 na koszyku, zamówieniu, koncie i kontakcie** wynika wyłącznie z audytu „Page is blocked from indexing”. Strony mają celowo `noindex`: koszyk, kasa i konto nie powinny trafiać do wyszukiwarki, a kontakt pozostaje szkicem, dopóki brakuje adresu do reklamacji. Po ustawieniu `status: ready` w `src/content/information/contact.md` kontakt dostanie 100.
- **Wydajność strony głównej na telefonie.** Lighthouse uznaje za największy element (LCP) dekoracyjną grafikę w sekcji „Selected collections” na pierwszym ekranie. Do tego ładują się okładki kolekcji i tekstury tła, a symulowane wolne 4G (ok. 1,6 Mb/s) wydłuża LCP do ok. 4 s. Na komputerze wynik to 99. Rzeczywisty czas na stronie wdrożonej można porównać w [PageSpeed Insights](https://pagespeed.web.dev/).
- **Dostępność 100 wszędzie.** Wcześniej osobno sprawdzono też axe-core (0 naruszeń) przy 360, 390 i 1440 px, w trybie wysokiego kontrastu i z ustawieniem systemowym `prefers-contrast: more`.

### Poprawki wprowadzone przy tym audycie

- Logo w nagłówku i hero: WebP 480 i 960 px z `srcset` zamiast PNG 1752 px (47 kB → 9 kB w nagłówku).
- Okładki i galerie produktów: szerokości 160/480/720/960/1200 px i jakość 76. Telefon pobiera 720 px zamiast 800–1200 px.
- Pierwsze dwie karty w sklepie ładują się od razu, a pierwsza dostaje `fetchpriority="high"`. Dekoracyjna grafika kolekcji na głównej też ma wysoki priorytet.
- Zdjęcie w sekcji About ma dodatkowy wariant 900 px.
- Preload dwóch najczęstszych krojów (Plex Mono 400 i Plex Sans 400).
- Journal na telefonie: lista kategorii jest ukryta, zanim skrypt ją zwinie. Wcześniej cała lista wpisów przeskakiwała (CLS 0,18 → 0).

## Schema.org

### Walidacja całego buildu

Każdy blok JSON-LD z 32 stron buildu porównano z oficjalnym słownikiem [schema.org 30.1](https://github.com/schemaorg/schemaorg/blob/main/data/releases/30.1/schemaorg-current-https.jsonld). Sprawdzono:

- czy typy i właściwości istnieją;
- czy dana właściwość pasuje do typu, uwzględniając dziedziczenie;
- czy typy wartości mieszczą się w zakresie właściwości;
- czy nie ma właściwości wycofanych.

Do tego sprawdzono wymagane i zalecane pola Google dla `Product`, `Offer`, `AggregateRating`, `Review`, `BreadcrumbList` i `Article`.

Wynik: **0 problemów**. Na stronach są typy:

- `Organization`, `WebPage`, `AboutPage`, `ContactPage`, `CollectionPage` z `ItemList`;
- `Product` z `Brand` i `AggregateRating`;
- `Article` z `Person` i `Blog`;
- `BreadcrumbList` na wszystkich podstronach.

### Walidatory zewnętrzne (wdrożona strona)

| Narzędzie                                                                                     | Strony                                                                      | Wynik                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [validator.schema.org](https://validator.schema.org/)                                         | główna, sklep, produkt 110, Journal, artykuł, About, kontakt, pomoc, koszyk | 0 błędów, 0 ostrzeżeń                                                                                                                                                   |
| [Test wyników z elementami rozszerzonymi Google](https://search.google.com/test/rich-results) | produkt 110                                                                 | 3 prawidłowe elementy: opis produktu, menu nawigacyjne, fragment opinii                                                                                                 |
| Test Google                                                                                   | artykuł `png-or-brushset`                                                   | Prawidłowy artykuł i menu nawigacyjne. Trzy uwagi niekrytyczne (data bez godziny i strefy czasowej, autor bez `url`) poprawiono; po poprawce test kodu nie zgłasza uwag |

### Do decyzji przed startem sprzedaży

- `Product` nie ma `offers`, bo ceny pochodzą z Etsy, a kasa jest demonstracją. Po uruchomieniu płatności warto dodać `Offer` z ceną, walutą i dostępnością.
- `AggregateRating` pokazuje oceny z Etsy. Wytyczne Google dotyczące fragmentów opinii zakładają oceny zebrane przez samą stronę, więc po starcie sklepu warto zbierać własne opinie albo zrezygnować z gwiazdek w danych strukturalnych. Same opinie na stronie mogą zostać.
