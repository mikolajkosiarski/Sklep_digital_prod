# VISAMORE — informacje i decyzje przed uruchomieniem sprzedaży

Stan researchu: 29.10.2026. Zakładany model: własny sklep z płatnościami i pobieraniem plików; obecny etap to statyczny frontend. To plan treści i wdrożenia, nie potwierdzenie zgodności gotowego sklepu. Przed startem finalne dokumenty trzeba dopasować do rzeczywistego sprzedawcy, krajów sprzedaży i dostawców usług.

## Strony i ich rola

| Strona               | Rola                                                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Contact              | Dane sprzedawcy i rzeczywista droga kontaktu. Osobny URL jest decyzją UX; wymagane informacje muszą być dostępne przed zakupem.                                          |
| Help / FAQ           | Formaty PNG i brushset, zgodność, pobieranie i typowe problemy. Przydatne dla zakupu, ale FAQ samo w sobie nie jest ustawowo wymaganym rodzajem strony.                  |
| Terms                | Warunki sprzedaży oraz usług elektronicznych, sposób zamówienia, płatności, dostarczenia, reklamacji i rozwiązania umowy.                                                |
| Privacy & cookies    | Obowiązek informacyjny o rzeczywistych procesach danych; cookies mogą być sekcją polityki, nie muszą mieć osobnej strony.                                                |
| License              | Jasny zakres używania kupionych plików. Osobna strona nie jest uniwersalnie wymagana, ale dla cyfrowych zasobów to ważny element oferty.                                 |
| Returns & complaints | Oddzielone odstąpienie, wyjątki dla plików cyfrowych oraz reklamacje z tytułu niezgodności. Link do formularza odstąpienia i rzeczywisty adres kontaktowy przed startem. |
| 404                  | Pomoc w powrocie do katalogu; element UX, nie dokument prawny.                                                                                                           |

Wymagania dotyczą przede wszystkim informacji, zrozumiałego języka i chwili ich udostępnienia. Linki do dokumentów w stopce nie zastępują czytelnego podsumowania bezpośrednio przed złożeniem zamówienia ani potwierdzenia umowy na trwałym nośniku. Źródła: [UOKiK — sprzedaż na odległość](https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/sprzedaz-poza-lokalem-i-na-odleglosc/), [UOKiK — pytania o obowiązki informacyjne](https://prawakonsumenta.uokik.gov.pl/pytania-i-odpowiedzi/prawo-do-informacji/), [Biznes.gov.pl — regulamin sklepu](https://biznes.gov.pl/pl/portal/00146).

## Dane potrzebne od właściciela

1. Sprzedawca: forma działalności, pełna nazwa, rzeczywisty adres, NIP lub właściwe dane rejestracyjne, e-mail, telefon, adres reklamacji/zwrotów jeśli inny.
2. Rynek: kraje sprzedaży, języki dokumentów i obsługi, waluty, sposób prezentowania podatków. Angielski projekt nie rozstrzyga obowiązków językowych przy kierowaniu sprzedaży do Polski.
3. Płatności: wybrany operator, metody, moment zawarcia umowy, faktury i obsługa nieudanych płatności.
4. Dostarczenie plików: e-mail czy konto, czas dostarczenia, wymagane dane klienta, limity i okres dostępu, ponowne pobieranie, obsługa uszkodzonych archiwów.
5. Specyfikacja paczek: rzeczywisty manifest plików, formaty, liczba wzorów, rozdzielczość, przezroczystość, wielkość pobierania, przetestowane wersje aplikacji/urządzeń. Unikać niezweryfikowanego „works with every app”.
6. Licencja: osobiste/komercyjne projekty, klienci, tatuaże, apparel, POD, limity nakładu, modyfikacje, sublicencje, przekazywanie plików zespołowi/drukarni, redystrybucja i odsprzedaż, wymagane autorstwo, czas i terytorium. Zweryfikować posiadanie praw do każdego sprzedawanego zasobu.
7. Fizyczne produkty: czy w ogóle startują ze sklepem, finalny producent, materiał, rozmiary, identyfikacja produktu, bezpieczeństwo, dostępność, regiony/koszty i terminy dostaw. Obecne koncepty nie są gotowymi ofertami.
8. Dane osobowe: administrator, hosting, poczta, operator płatności, dostawca plików, księgowość, transfery poza EOG, retencja dla konkretnych celów, ewentualna analityka/marketing/konto/newsletter.
9. Opinie: autentyczne recenzje, zakres zgody na cytowanie, źródło i sposób weryfikacji. Statystyki sprzedaży zachować z datą i źródłem; wznowienia ofert nie są tym samym co transakcje.

## Czego nie wpisywać automatycznie

- „All digital sales are final / no refunds”: prawo odstąpienia dla płatnych plików może zostać wyłączone dopiero przy spełnieniu przesłanek ustawowych. Wymagana jest wyraźna uprzednia zgoda na dostarczenie, przyjęcie informacji o utracie prawa oraz utrwalenie odpowiedniego potwierdzenia. Sam checkbox akceptacji regulaminu nie załatwia osobnego procesu. Prawa dotyczące niezgodności z umową to odrębna kwestia. [UOKiK — treści cyfrowe](https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/umowy-szczegolne/).
- „Made to order means no returns”: sam druk po zamówieniu nie przesądza o indywidualizacji. Wyjątek dotyczy faktycznej specyfikacji konsumenta lub jego indywidualnych potrzeb. [UOKiK — wyjątki](https://prawakonsumenta.uokik.gov.pl/prawo-odstapienia-od-umowy/wylaczenia-prawa-do-odstapienia/).
- Fikcyjnego kontaktu, darmowej wysyłki, stałego terminu odpowiedzi, lifetime downloads, konkretnej licencji komercyjnej lub domniemanego operatora płatności.
- Automatycznego banera cookies bez technologii, dla której jest potrzebny. Obecny kod nie konfiguruje śledzenia ani storage; przy publicznym hostingu trzeba opisać także logi i rzeczywiste przepływy danych. Dla opcjonalnych technologii sprawdzić zgodę przed uruchomieniem i skuteczne wycofanie. [PKE art. 399–400](https://eli.gov.pl/api/acts/DU/2024/1221/text.html), [RODO art. 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj), [UODO — retencja](https://uodo.gov.pl/pl/676/4260).
- Starego linku do platformy ODR: została zamknięta 20.07.2025. Nie utożsamiać tego z końcem pozostałych możliwości pozasądowego rozwiązywania sporów. [Komisja Europejska](https://consumer-redress.ec.europa.eu/site-relocation_en), [rozporządzenie 2024/3228](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32024R3228).

## Wymagania dla przyszłej ścieżki zakupowej

- Przed zapłatą: kompletne cechy produktu, zgodność i ograniczenia, dokładna licencja, cena z podatkami, dodatkowe koszty i dostawa; możliwość poprawienia zamówienia i jednoznacznie płatny przycisk końcowy.
- Potwierdzenie zamówienia i warunków na trwałym nośniku; wersjonowanie zaakceptowanych dokumentów i zapis zgód. Dostarczenie plików dopiero po zweryfikowanym potwierdzeniu płatności po stronie serwera.
- Obszar pobierania, stany sukces/pending/error, ponowienie dostarczenia, odzyskanie dostępu, zabezpieczone pliki i ograniczony dostęp. To praca backendowa, poza obecnym zakresem.
- Odstąpienie/reklamacja musi mieć działającą drogę obsługi. Dyrektywa UE 2023/2673 wprowadza ponadto funkcję odstąpienia online z potwierdzeniem na trwałym nośniku. Harmonogram dyrektywy przewiduje stosowanie przepisów wdrażających od 19.06.2026, ale nie należy utożsamiać go automatycznie z zakończonym wdrożeniem krajowym. Przed uruchomieniem sprawdzić aktualny polski stan prawny i kraje klientów; uwzględnić tę funkcję w projekcie backendu. [Dyrektywa, art. 11a i art. 2](https://eur-lex.europa.eu/eli/dir/2023/2673/oj/eng), [UOKiK o implementacji](https://uokik.gov.pl/bip/implementacja-dyrektywy-parlamentu-europejskiego-i-rady-ue-2023-2673).
- Przy promocjach i publikowaniu recenzji dodać wymagane informacje o obniżce i weryfikacji opinii, zamiast generować pozorne social proof. [UOKiK — obniżki](https://prawakonsumenta.uokik.gov.pl/prawo-do-informacji/informacje-o-obnizkach-cen/) oraz obowiązki opinii w źródle o sprzedaży na odległość.
- Dla fizycznych produktów uzupełnić wymagane informacje w ofercie online (producent, w odpowiednich przypadkach osoba odpowiedzialna w UE, identyfikacja, wymagane ostrzeżenia). [PARP — GPSR](https://kpo.parp.gov.pl/component/content/article/86075%3Aunijne-rozporzadzenie-o-ogolnym-bezpieczenstwie-produktow-nowy-porzadek-od-13-grudnia-2024-r).
- Zachować dostępność formularzy, płatności i treści. Osobno ustalić, czy firma podlega Polskiemu Aktowi o Dostępności; usługi mikroprzedsiębiorców są wyłączone z jego zakresu, co nie jest powodem do obniżania jakości UI. Nie deklarować automatycznie pełnej zgodności. [PFRON — handel elektroniczny i mikroprzedsiębiorcy](https://dostepnosc.pfron.org.pl/dostepnosc-produktow-i-uslug/tytul-domyslny-2/news/jaki-podmiot-jest-odpowiedzialny-za-spelnianie-wymagan-dostepnosci-w-zakresie-uslug-handlu-elektronicznego).

## Zakres weryfikacji źródeł

Informacje konsumenckie oparto na aktualnie dostępnych stronach UOKiK i aktach UE. Zidentyfikowano nowszy polski tekst jednolity ustawy o prawach konsumenta: [Dz.U. 2026 poz. 1244, ogłoszony 23.09.2026](https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20260001244); pełne pobranie tekstu przez narzędzie było blokowane. Przed publikacją dokumentów sprzedaży należy sprawdzić także późniejsze nowelizacje i wejście w życie przepisów o funkcji odstąpienia. Szkice nie udają kompletnego finalnego regulaminu.
