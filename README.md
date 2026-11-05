# Visamore

Responsywny serwis marki Visamore: **Astro 7, Tailwind CSS 4 i TypeScript**. Wspólne komponenty obsługują stronę główną, katalogi Digital i Physical, strony produktów, Journal oraz strony informacyjne.

## Uruchomienie

Wymagany Node.js **22.23.4 lub nowszy**.

```sh
npm ci
npm run dev -- --background
```

Podgląd: [http://127.0.0.1:4321/](http://127.0.0.1:4321/).

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Można też uruchomić `npm run dev` w terminalu i zakończyć Ctrl+C. Serwer nasłuchuje na lokalnym komputerze. Główną kopią roboczą jest ten projekt na MacBooku; kopie archiwalne i dysk dostępny przez Tailscale są osobne.

## Struktura

```text
src/
  pages/         adresy stron i generowanie podstron
  layouts/       wspólny dokument HTML, produkt, artykuł, informacje
  components/    header, footer, karty, przyciski i sekcje
  content/       opisy produktów, artykuły i informacje w Markdown
  data/          katalog, nawigacja, autor, statystyki i opinie
  lib/           modele, walidacja danych, ceny i adresy URL
  scripts/       menu, katalog, galeria, koszyk, formularz
  styles/        tokeny, Tailwind i style według komponentów
  assets/        zdjęcia ofertowe optymalizowane przez Astro
public/          grafiki, lokalne fonty z licencjami, tekstury i film
docs/            instrukcje edycji, źródła i zakres projektu
tests/           testy koszyka, statystyk i bezpieczeństwa Markdown
tools/           walidacja buildu i Markdown
```

Edytuj pliki w `src/`. `node_modules/`, `.astro/` i `dist/` są generowane lokalnie i pomijane przez Git. Archiwalne porównywarki, szkice stylów, zrzuty i logi robocze znajdują się poza aplikacją. Projekt nie zawiera tras `/design/` ani przełączania wariantów wyglądu.

## Wspólne elementy

- `src/layouts/BaseLayout.astro` składa dokument HTML, metadane, tło, header, footer i obsługę koszyka.
- `src/components/layout/Header.astro` i `Footer.astro` są wspólne dla wszystkich stron. Na telefonie układ to Menu / logo / Cart.
- `src/components/catalog/ProductCard.astro` jest jedynym szablonem kart Digital, Physical i produktów powiązanych. Wybrany styl **Full print** ma obraz na pełną szerokość oraz opis, cenę i zakup poniżej. Style są w `src/styles/components/product-card.css`.
- `src/components/ui/TerminalButton.astro` obsługuje link lub przycisk. Wygląd **Terminal relic** to tekst i obracany pikselowy plus, bez wypełnienia i obrysu. Fokus oraz ograniczenie animacji są w `src/styles/components/buttons.css`.
- `src/lib/storefront.ts` normalizuje dane obu katalogów dla tych samych kart i koszyka.

Główna prezentuje cztery kolekcje Digital w rzędzie na dużym ekranie, dwie na tablecie i jedną na telefonie. W wąskich kartach cena i przycisk zajmują osobne wiersze. Tło wylinki zachowuje chłodne szarości i krycie 30%; źródło wzoru to `public/textures/serpent.svg`, a parametry tła są w `src/styles/components/surface.css`.

## Edycja treści

| Element                                              | Miejsce edycji                      |
| ---------------------------------------------------- | ----------------------------------- |
| Digital: opis, cena, parametry, galeria, film        | `src/content/products/<id>.md`      |
| Tytuły i krótkie opisy katalogowe, okładki, Physical | `src/data/shop-content.json`        |
| Blog                                                 | `src/content/journal/<slug>.md`     |
| Autor artykułów                                      | `src/data/journal-authors.ts`       |
| Pomoc, kontakt, dokumenty                            | `src/content/information/*.md`      |
| Opinie Etsy i profile społecznościowe                | `src/data/community-content.json`   |
| Statystyki sprzedaży Etsy                            | `src/data/etsy-sales-all-time.json` |
| Nawigacja                                            | `src/data/navigation.ts`            |

Digital korzysta z jednego szablonu `src/layouts/ProductPage.astro`; opisy Markdown są przekazywane przez slot. Journal korzysta z `JournalPost.astro`, wspólnej karty artykułu i archiwum z paginacją. Kontakt ma osobną trasę, ale formularz i sekcja na głównej są wspólne. Kolekcje treści są walidowane w `src/content.config.ts`.

Instrukcje: [produkty](docs/product-editing.md), [Journal](docs/journal-editing.md), [kontakt](docs/contact-editing.md), [opinie](docs/etsy-reviews.md), [źródła zasobów](docs/asset-sources.md).

## Obecny zakres

Build generuje **34 strony treści** oraz przekierowania starych adresów `.html`:

- strona główna;
- Digital: katalog i sześć produktów;
- Physical: katalog i pięć koncepcji koszulek;
- Journal: archiwum, druga strona archiwum i osiem artykułów;
- About i koszyk;
- Contact, Help, Delivery, Terms, Privacy, License i Returns;
- strona 404.

Koszyk działa lokalnie: Digital można dodać raz, Physical do 99 sztuk. Zapisuje wyłącznie identyfikatory i ilości; ceny i nazwy odczytuje z katalogu. Sumy są liczone w eurocentach. Robocze ceny Digital pochodzą z Etsy, Physical kosztuje €30 za sztukę.

Kontakt i komentarze walidują oraz pokazują tekst lokalnie. Nie wysyłają wiadomości ani nie publikują komentarzy. Opinie na głównej przepisano z czterech dostarczonych zrzutów Etsy; źródła są zachowane w `docs/sources/etsy-reviews/`. Statystyki oznaczają transakcje sprzedaży za cały czas, stan na 23 października 2026; wznowienia ofert są zapisane oddzielnie.

Płatności, zamówienia, konta i zabezpieczone pobieranie plików są kolejnym etapem. Warunki sprzedaży i pozostałe dokumenty wymagają potwierdzenia danych sprzedawcy oraz dopasowania do przyszłej obsługi zamówień. Profile społecznościowe czekają na właściwe adresy. Lista danych do uzupełnienia: [uruchomienie sklepu](docs/store-launch-information.md).

## Sprawdzanie zmian

```sh
npm run format:check
npm test
npm run build
```

Build sprawdza typy Astro, generuje strony i kontroluje lokalne linki, grafiki, identyfikatory sekcji oraz JSON-LD. Testy obejmują koszyk, źródłowe statystyki i renderer Markdown. Markdown odrzuca surowy HTML i niebezpieczne schematy adresów; nie zastępuje to zabezpieczeń przyszłego backendu.

Po zmianach układu sprawdź w przeglądarce szerokości 360–390, 768 i co najmniej 1200 px, menu oraz obsługę klawiaturą. Formalny audyt Lighthouse i zewnętrzna walidacja Schema.org pozostają osobnymi punktami odbioru.

## Historia etapów

Historia na gałęzi `main` jest podzielona na CW3, CW4, sklep, pozostałe podstrony, poprawkę gwiazdek opinii i wdrożenie GitHub Pages. Zakres commitów i odpowiadające tagi opisuje [docs/git-stages.md](docs/git-stages.md). Etapy wydzielono z istniejącego projektu; każdy jest sprawdzany oddzielnie.

## GitHub i wdrożenie

Repozytorium: [mikolajkosiarski/Sklep_digital_prod](https://github.com/mikolajkosiarski/Sklep_digital_prod).

Strona: [mikolajkosiarski.github.io/Sklep_digital_prod](https://mikolajkosiarski.github.io/Sklep_digital_prod/).

Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) po każdym pushu na `main` uruchamia testy, sprawdzanie typów, build Astro i walidację odnośników. Publikacja następuje tylko po ich powodzeniu. Można ją też uruchomić ręcznie w zakładce Actions. Źródłem GitHub Pages są GitHub Actions.

Workflow ustawia `SITE_URL=https://mikolajkosiarski.github.io` oraz `BASE_PATH=/Sklep_digital_prod`. Dzięki temu metadane, linki i zasoby wskazują podkatalog repozytorium. Lokalny serwer nadal działa pod `/`. Walidator buildu korzysta z tego samego `BASE_PATH` i wykrywa odnośniki wychodzące poza katalog wdrożenia.

Lokalne sprawdzenie konfiguracji produkcyjnej:

```sh
SITE_URL=https://mikolajkosiarski.github.io BASE_PATH=/Sklep_digital_prod npm run build
```

Nie zapisuj tokenów ani plików `.env` w repozytorium. Workflow korzysta z uprawnień GitHuba do publikacji Pages i nie wymaga własnego tokena. Do projektu dołączamy podglądy ofert, a nie pełne płatne paczki dla klientów.
