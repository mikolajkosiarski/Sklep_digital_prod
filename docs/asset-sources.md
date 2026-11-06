# Źródła zasobów

- Grafiki Visamore, okładki, zdjęcia ofertowe i ramy pochodzą z dotychczasowego projektu marki. Zapisy źródeł zostały przeniesione z publicznych katalogów do `docs/sources/assets/`, z zachowaniem podziału `digital/` i `frames/`.
- `docs/product-listing-photo-sources.json` zachowuje pochodzenie dodatkowych zdjęć ofertowych.
- Zdjęcia Digital do optymalizacji są w `src/assets/listings/`. Kopie zdjęć galerii, których strona już nie używała w `public/`, zachowano w osobnym archiwum projektu.
- `public/assets/frames/parts/128/` zawiera narożniki ramy używane w hero jako WebP 480 i 960 px. Wycięto je z oryginalnego PNG ramy 128 według `viewBox` z `docs/sources/assets/frames/parts.json`, bez retuszu; dawne SVG osadzały ten sam PNG 4096 px i ważyły po 260 kB.
- `public/assets/frames/brd0125_nb_4096x4096.png` pozostaje używaną ilustracją Journal.
- Wybrana typografia to IBM Plex Mono i Pinyon Script. Licencje SIL OFL są obok fontów: `public/assets/fonts/plex-OFL.txt` oraz `public/assets/fonts/pinyon-script/OFL.txt`.
- `public/textures/` zawiera używane wektorowe tekstury tła i ilustracji artykułów. Wylinka to `serpent.svg`; układ warstw jest w `src/styles/components/surface.css`.
- Zrzuty stanowiące źródło opinii są w `docs/sources/etsy-reviews/`. Strona renderuje tekst opinii, bez osadzania zrzutów.

Zasoby są podglądami używanymi przez serwis. Projekt nie zawiera pełnych płatnych paczek przeznaczonych do pobierania przez klientów.

- `public/assets/digital/angel-sig0011-640.webp` i `-1280.webp` (sekcja „About Visamore” na głównej) to wzór `sig0011` z paczki 110 Dark Art Tattoos (`110_designs_bundle_v1/transparent_bg/sig0011_t_4096x4096.png`). Biały oryginał przycięto do konturu i przebarwiono na kolor tekstu strony `#282828` z zachowaniem przezroczystości. W repozytorium jest tylko podgląd do 1280 px, bez pliku źródłowego 4096 px.
