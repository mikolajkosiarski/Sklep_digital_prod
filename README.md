# Visamore

Responsywny serwis marki Visamore: **Astro 7, Tailwind CSS 4 i TypeScript**. Sklep z cyfrowymi kolekcjami (PNG i pędzle Procreate): strona główna, sklep z filtrami, strony produktów, koszyk, demo kasy, demo konta klienta, Journal oraz strony informacyjne.

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
  scripts/       menu, sklep, galeria, koszyk, kasa, konto, formularz
  styles/        tokeny, Tailwind i style według komponentów
  assets/        zdjęcia ofertowe optymalizowane przez Astro
public/          grafiki, lokalne fonty z licencjami, tekstury i film
docs/            instrukcje edycji, źródła i zakres projektu
tests/           testy koszyka, statystyk i bezpieczeństwa Markdown
tools/           walidacja buildu i Markdown
```

### Tailwind i style

Kolory, fonty, rozmiary tekstu i breakpointy są zdefiniowane raz w `@theme` w `src/styles/global.css` (`--color-ink`, `--color-muted`, `--color-line`, `--color-paper`, `--font-mono`, `--font-display`; breakpointy `xs` 360 px, `sm` 576 px, `md` 768 px, `lg` 992 px, `xl` 1200 px). Style komponentów korzystają z tych samych zmiennych i z dyrektywy `@variant` zamiast ręcznych `@media`. W blokach `<style>` komponentów Astro jest `@reference` do `global.css`, a `@variant` stoi wewnątrz selektora, żeby zachować zakres komponentu. Układy siatek i pas kart na telefonie są zapisane klasami Tailwinda w znacznikach.

Edytuj pliki w `src/`. `node_modules/`, `.astro/` i `dist/` są generowane lokalnie i pomijane przez Git. Archiwalne porównywarki, szkice stylów, zrzuty i logi robocze znajdują się poza aplikacją. Projekt nie zawiera tras `/design/` ani przełączania wariantów wyglądu.

## Wspólne elementy

- `src/layouts/BaseLayout.astro` składa dokument HTML, metadane, tło, header, footer i obsługę koszyka.
- `src/components/layout/Header.astro` i `Footer.astro` są wspólne dla wszystkich stron. Menu: Shop, Journal, About, Help, Account i Cart z licznikiem. Na telefonie układ to Menu / logo / Cart.
- `src/components/ui/Breadcrumbs.astro` to jedne okruszki dla wszystkich stron (lista `<ol>`, „Home” na początku, `aria-current`, dane BreadcrumbList). `src/components/ui/Pagination.astro` obsługuje paginację sklepu i Journala. Style obu są w `src/styles/components/wayfinding.css`.
- `src/components/catalog/ProductCard.astro` jest jedynym szablonem kart w sklepie, na głównej i w produktach powiązanych. Styl **Full print**: obraz na pełną szerokość, etykieta (Bestseller przy co najmniej 100 sprzedażach na Etsy albo Sale przy promocji), tytuł `h3`, ocena, cena (z przekreśloną ceną regularną przy promocji) i przycisk „View details”. Style bazowe są w `src/styles/components/product-card.css`.
- `src/components/ui/TerminalButton.astro` obsługuje link lub przycisk. Wygląd **Terminal relic** to tekst i obracany pikselowy plus, bez wypełnienia i obrysu. Fokus oraz ograniczenie animacji są w `src/styles/components/buttons.css`.
- `src/lib/storefront.ts` normalizuje dane kolekcji dla kart, sklepu i koszyka.
- `src/components/ui/Icon.astro` wstawia ikony z biblioteki Bootstrap Icons (pakiet npm `bootstrap-icons`) jako SVG w HTML. Używane są tylko pliki ikon (kosz w koszyku, pobieranie, edycja, potwierdzenie); Bootstrap CSS ani JS nie są ładowane.

Główna prezentuje cztery kolekcje Digital w rzędzie na dużym ekranie i dwie na tablecie. Na telefonie karty tworzą przewijany w poziomie pas z przyciąganiem, w którym kolejna karta częściowo wystaje (`src/lib/layout-classes.ts`). W wąskich kartach cena i przycisk zajmują osobne wiersze. Tło wylinki zachowuje chłodne szarości i krycie 30%; źródło wzoru to `public/textures/serpent.svg`, a parametry tła są w `src/styles/components/surface.css`.

## Edycja treści

| Element                                                   | Miejsce edycji                      |
| --------------------------------------------------------- | ----------------------------------- |
| Digital: opis, cena, parametry, galeria, film             | `src/content/products/<id>.md`      |
| Tytuły, krótkie opisy, style (filtry), okładki            | `src/data/shop-content.json`        |
| Ocena z Etsy, wybrane opinie, promocja (`compareAtMinor`) | `src/content/products/<id>.md`      |
| Dane kontaktowe i nazwa podmiotu (placeholdery)           | `src/data/contact-details.json`     |
| Przykładowe konto i zamówienia (demo)                     | `src/data/demo-account.json`        |
| Blog                                                      | `src/content/journal/<slug>.md`     |
| Autor artykułów                                           | `src/data/journal-authors.ts`       |
| Pomoc, kontakt, dokumenty                                 | `src/content/information/*.md`      |
| Opinie Etsy i profile społecznościowe                     | `src/data/community-content.json`   |
| Statystyki sprzedaży Etsy                                 | `src/data/etsy-sales-all-time.json` |
| Nawigacja                                                 | `src/data/navigation.ts`            |

Digital korzysta z jednego szablonu `src/layouts/ProductPage.astro`; opisy Markdown są przekazywane przez slot. Journal korzysta z `JournalPost.astro`, wspólnej karty artykułu i archiwum z paginacją. Kontakt ma osobną trasę, ale formularz i sekcja na głównej są wspólne. Kolekcje treści są walidowane w `src/content.config.ts`.

Instrukcje: [produkty](docs/product-editing.md), [Journal](docs/journal-editing.md), [kontakt](docs/contact-editing.md), [opinie](docs/etsy-reviews.md), [źródła zasobów](docs/asset-sources.md).

## Obecny zakres

Build generuje **30 stron treści** oraz przekierowania starych adresów (`.html`, `/digital/…` → `/shop/…`, wycofane `/physical/…` → `/shop/`):

- strona główna;
- sklep `/shop/` i sześć produktów `/shop/<id>/`;
- koszyk, demo kasy `/checkout/` i demo konta `/account/`;
- Journal: archiwum, druga strona archiwum i osiem artykułów;
- About;
- Contact, Help, Delivery, Terms, Privacy, License i Returns;
- strona 404.

Koszyk działa lokalnie: każdą kolekcję można dodać raz (jedna licencja na zamówienie). Zapisuje wyłącznie identyfikatory i ilości; ceny i nazwy odczytuje z katalogu. Sumy są liczone w eurocentach. Kod `VISAMORE10` to oznaczony kod demonstracyjny (−10%). Ceny pochodzą z Etsy.

Kasa i konto są wyraźnie oznaczonymi demonstracjami: formularz kasy nie wysyła danych, a po poprawnym wypełnieniu zapisuje w `sessionStorage` tylko numer zamówienia, produkty i sumę, czyści koszyk i pokazuje potwierdzenie w panelu konta. Konto pokazuje przykładowego klienta z `src/data/demo-account.json`.

### Moduł sklepu (CW5): pliki z instrukcji i trasy Astro

| Instrukcja        | Trasa / plik w projekcie                                                                                   |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `index.html`      | `/` → `src/pages/index.astro`; sekcja `#sklep` w `src/components/home/FeaturedCollections.astro`           |
| `sklep.html`      | `/shop/` → `src/pages/shop/index.astro`, `src/components/catalog/ShopCatalog.astro`, `src/scripts/shop.ts` |
| `produkt.html`    | `/shop/<id>/` → `src/layouts/ProductPage.astro`, `ProductPurchase.astro`, `ProductTabs.astro`              |
| `koszyk.html`     | `/cart/` → `src/components/cart/CartView.astro`, `CartLine.astro`, `src/scripts/cart.ts`                   |
| `zamowienie.html` | `/checkout/` → `src/pages/checkout.astro`, `src/scripts/checkout.ts`                                       |
| `konto.html`      | `/account/` → `src/pages/account.astro`, `src/scripts/account.ts`                                          |
| `style.css`       | `src/styles/global.css`; blok `/* MODUŁ E-COMMERCE */` w `src/styles/components/ecommerce.css`             |

Odstępstwa uzgodnione z charakterem sklepu: zamiast Bootstrapa jest Astro + Tailwind (komponenty `badge`, `table-responsive`, `nav-pills`, zakładki i paginacja są własnymi komponentami); menu zostało tekstowe („Account”, „Cart (n)” z prawdziwym licznikiem zamiast ikon i statycznej cyfry); dostawa w kasie jest cyfrowa (link e-mailem, pobranie z konta) zamiast kuriera i paczkomatu; wariantem produktu jest licencja (Standard albo Extended na wycenę), a liczba sztuk jest ograniczona do 1.

Kontakt i komentarze walidują oraz pokazują tekst lokalnie. Nie wysyłają wiadomości ani nie publikują komentarzy. Opinie na głównej przepisano z czterech dostarczonych zrzutów Etsy; źródła są zachowane w `docs/sources/etsy-reviews/`. Statystyki oznaczają transakcje sprzedaży za cały czas, stan na 23 października 2026; wznowienia ofert są zapisane oddzielnie.

Prawdziwe płatności, zamówienia, logowanie i zabezpieczone pobieranie plików są kolejnym etapem (backend poza zakresem frontendu). Warunki sprzedaży i pozostałe dokumenty wymagają potwierdzenia danych sprzedawcy oraz dopasowania do przyszłej obsługi zamówień. Profile społecznościowe czekają na właściwe adresy; sekcja „Elsewhere” pojawia się automatycznie, gdy w `src/data/community-content.json` jest choć jeden adres profilu. Lista danych do uzupełnienia: [uruchomienie sklepu](docs/store-launch-information.md).

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
