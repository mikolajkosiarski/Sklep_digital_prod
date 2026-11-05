# Etapy historii Git

Historia została uporządkowana lokalnie 5 listopada 2026 na podstawie istniejącego projektu. Są to działające etapy wydzielone z bieżącej wersji, a nie zapis wcześniejszych dat pracy. Każdy etap jest osobno kompilowany i sprawdzany przed utworzeniem commita.

| Etap                 | Zakres                                                                                                                                  | Commit                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 1 / CW3              | Astro, Tailwind, wspólny dokument, header i footer, hero, opis marki i oferty, kontakt, RWD, bezpieczny Markdown.                       | `feat(cw3): establish responsive Astro site and contact form` |
| 2 / CW4              | Artykuły Markdown, szablon wpisu, archiwum, paginacja, wyszukiwanie i kategorie, autor, ilustracje, udostępnianie i podgląd komentarzy. | `feat(cw4): add Markdown journal and archive`                 |
| 3 / Sklep            | Katalogi Digital i Physical, opisy produktów, wspólne karty Full print, galerie, ceny, film i lokalny koszyk.                           | `feat(store): add catalogues, product pages and local cart`   |
| 4 / Pozostałe strony | About, pomoc, szkice dokumentów, rzeczywiste opinie Etsy, sekcja społecznościowa, finalna nawigacja i dokumentacja.                     | `feat(site): complete information pages and Etsy reviews`     |
| 5 / Wygląd           | Większe gwiazdki ocen w opiniach.                                                                                                       | `style(reviews): enlarge rating stars`                        |

Tagi `etap-1-cw3`, `etap-2-cw4`, `etap-3-sklep`, `etap-4-podstrony` i `etap-5-opinie` wskazują odpowiadające etapy. Finalny kod jest na gałęzi `main`. Wcześniejsze etapy można oglądać w osobnym katalogu przez `git worktree add <folder> <tag>` bez cofania uruchomionej wersji.

Zależności, wygenerowane pliki i lokalne archiwa nie są śledzone. Ta operacja tworzy historię lokalną; nie wysyła kodu i nie wdraża GitHub Pages. Testy i build nie zastępują formalnego audytu Lighthouse ani zewnętrznej walidacji Schema.org.
