# Źródła zasobów

- Grafiki Visamore, okładki, zdjęcia ofertowe i ramy pochodzą z dotychczasowego projektu marki. Zapisy źródeł zostały przeniesione z publicznych katalogów do `docs/sources/assets/`, z zachowaniem podziału `digital/` i `frames/`.
- `docs/product-listing-photo-sources.json` zachowuje pochodzenie dodatkowych zdjęć ofertowych.
- Zdjęcia Digital do optymalizacji są w `src/assets/listings/`. Kopie zdjęć galerii, których strona już nie używała w `public/`, zachowano w osobnym archiwum projektu.
- `public/assets/frames/parts/128/` zawiera narożniki ramy używane w hero jako WebP 480 i 960 px. Wycięto je z oryginalnego PNG ramy 128 według `viewBox` z `docs/sources/assets/frames/parts.json`, bez retuszu; dawne SVG osadzały ten sam PNG 4096 px i ważyły po 260 kB.
- `public/assets/frames/brd0125_nb_4096x4096.png` pozostaje używaną ilustracją Journal.
- `public/assets/journal/<paczka>-sig<numer>-560.webp` i `-1000.webp` to okładki wpisów Journal: ulubione wzory właściciela z paczek 110 Dark Art (sig0027, sig0093, sig0099, sig0100) i 54 Dark Romance (sig0029, sig0033, sig0044, sig0054), wybrane w kwestionariuszu z 19.11.2026. Zrobiono je z kafelków ofertowych 1000 px (`src/assets/listings/<paczka>-design-sig<numer>.webp`): skala szarości, jasne tło `#f7f7f7` podniesione do bieli, żeby wzór wtapiał się w powierzchnię. Każdy wpis ma inny wzór; przypisanie jest w polu `art` wpisu.
- Wybrana typografia to IBM Plex Mono, IBM Plex Sans i Pinyon Script. Plex Sans (wagi 400, 400 italic i 500, podzbiory latin i latin-ext) pochodzi z pakietu `@fontsource/ibm-plex-sans` 5.3.0 i składa dłuższy tekst dziennika; Plex Mono zostaje w tytułach, etykietach i interfejsie. Licencje SIL OFL są obok fontów: `public/assets/fonts/plex-OFL.txt`, `public/assets/fonts/plex-sans/OFL.txt` oraz `public/assets/fonts/pinyon-script/OFL.txt`.
- `public/textures/` zawiera używane wektorowe tekstury tła i ilustracji artykułów. Wylinka to `serpent.svg`; układ warstw jest w `src/styles/components/surface.css`.
- Zrzuty stanowiące źródło opinii są w `docs/sources/etsy-reviews/`. Strona renderuje tekst opinii, bez osadzania zrzutów.

Zasoby są podglądami używanymi przez serwis. Projekt nie zawiera pełnych płatnych paczek przeznaczonych do pobierania przez klientów.

- `public/assets/digital/angel-sig0011-640.webp`, `-900.webp` i `-1280.webp` (sekcja „About Visamore” na głównej) to wzór `sig0011` z paczki 110 Dark Art Tattoos (`110_designs_bundle_v1/transparent_bg/sig0011_t_4096x4096.png`). Biały oryginał przycięto do konturu i przebarwiono na kolor tekstu strony `#282828` z zachowaniem przezroczystości. W repozytorium jest tylko podgląd do 1280 px, bez pliku źródłowego 4096 px.

- Paczki 110 i 54 (dodane 19 listopada 2026): okładki `etsy-110-cover.webp` i `etsy-54-cover.webp` oraz zdjęcia `110-listing-1…3.webp` i `54-listing-1…3.webp` to oryginalne grafiki ofert Etsy, wgrane przez właściciela w kwestionariuszu treści. Pomniejszono je do maks. 1600 px, bez retuszu.
- `110-design-sig*.webp` i `54-design-sig*.webp` to ulubione wzory wybrane przez właściciela (9 z paczki 110 i 6 z paczki 54). Powstały z podglądów laboratorium przymierzalni (768 px): kontur z kanału alfa w kolorze `#282828` na tle `#f7f7f7`, kwadrat 1000 px. Pełnych plików 4096 px nie ma w repozytorium.
- `public/assets/video/pack-110-preview.mp4` i `pack-54-preview.mp4` to nagrania ekranu z Procreate (15 i 13 s, 1280 × 1280 px, bez dźwięku) z folderów `oferta_110_designs` i `oferta_54_designs` właściciela. Plakaty `110-video-poster.webp` i `54-video-poster.webp` to klatki z tych nagrań.
- `public/assets/visamore-tag-480.webp` i `-960.webp` to zmniejszone kopie logo `visamore-tag.png` (1752 px) dla nagłówka i hero. PNG zostaje jako logo w danych strukturalnych.
