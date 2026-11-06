# Edycja produktów

## Wspólny szablon karty

`src/components/catalog/ProductCard.astro` renderuje kolekcje na głównej, w sklepie `/shop/` i w produktach powiązanych. Ma jeden wygląd: **Full print**, z obrazem na pełną szerokość oraz metryczką poniżej. Zmiana komponentu lub `src/styles/components/product-card.css` aktualizuje wszystkie te miejsca. Dane przygotowuje `src/lib/storefront.ts`.

Miniatura, tytuł i przycisk „View details” prowadzą do strony produktu; do koszyka dodaje się z niej. Etykieta „Bestseller” pojawia się przy co najmniej 100 sprzedażach w `src/data/etsy-sales-all-time.json` (próg `BESTSELLER_SALES` w `src/lib/catalog.ts`), a „Sale” zamiast niej przy promocji. `headingLevel` pozwala dostosować nagłówek do hierarchii strony; nie wybiera stylu karty.

## Digital

Treść oferty i cenę edytuj w `src/content/products/<id>.md`. Tekst pod frontmatter jest opisem Markdown przekazywanym przez slot do `src/layouts/ProductPage.astro`. Zmiana opisu nie wymaga edycji szablonu.

| Pole                                    | Znaczenie                                                                                                                  |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `priceMinor`                            | Cena w eurocentach, np. `1199` to €11.99.                                                                                  |
| `designCount`                           | Liczba różnych wzorów.                                                                                                     |
| `resolution`, `resolutionDetail`, `dpi` | Potwierdzone parametry plików; `dpi` jest opcjonalne.                                                                      |
| `motifs`, `packaging`                   | Motywy i sposób przygotowania paczki.                                                                                      |
| `gallery`                               | Nazwy plików z `src/assets/listings/` i opisy `alt`.                                                                       |
| `video`                                 | Opcjonalny lokalny film, poster i opis.                                                                                    |
| `relatedIds`                            | Identyfikatory innych istniejących ofert.                                                                                  |
| `compareAtMinor`                        | Cena regularna tylko przy prawdziwej promocji; karta i strona pokazują ją przekreśloną.                                    |
| `rating`                                | Średnia i liczba opinii z oferty na Etsy (`average`, `count`, `checkedOn`). Przepisuj z Etsy, nie licz z wybranych opinii. |
| `reviews`                               | Wybrane opinie z Etsy (`author`, `rating`, `date`, `text`), wyświetlane jako „Selected reviews”.                           |

Wpis katalogowy z tym samym identyfikatorem musi istnieć w `src/data/shop-content.json`. Tam są krótkie tytuły, opisy, style (`styles`, filtr „Style” w sklepie; dozwolone wartości w `styleLabels` w `src/lib/catalog.ts`), formaty i okładki. Okładki leżą wyłącznie w `src/assets/listings/` jako `etsy-<id>-cover.jpg`; pole `cover` podaje inną nazwę pliku tylko wtedy, gdy jest potrzebna. Astro tworzy z nich zarówno obrazy kart, jak i podgląd linku (og:image). `src/lib/offers.ts` sprawdza zgodność identyfikatorów, powiązań i lokalnych mediów. Ceny Digital mają robocze źródło Etsy z 23 października 2026, opisane w `src/data/digital-offers.json`.

`src/lib/product-media.ts` przygotowuje WebP w kilku szerokościach. Galeria używa `srcset`, pełnego podglądu i klawiatury. Okładka katalogowa jest automatycznie dodawana do galerii. Film paczki 300 jest w `public/assets/video/pack-300-preview.mp4`, bez autoplay i z natywnymi kontrolkami.

## Dane i źródła

Statystyki w `src/data/etsy-sales-all-time.json` opisują transakcje sprzedaży, nie wznowienia. Nie należy przypisywać danych archiwalnej oferty do innego produktu. Zapis źródeł zdjęć jest w `docs/product-listing-photo-sources.json` i `docs/sources/assets/`.

Do katalogu dodawaj wyłącznie podglądy. Płatne pliki dla klientów nie powinny trafiać do `public/` ani repozytorium. Koszyk, kasa i konto są lokalnym demo; rzeczywiste zamówienia, płatności, licencje i dostawa plików wymagają backendu i dalszych ustaleń.
