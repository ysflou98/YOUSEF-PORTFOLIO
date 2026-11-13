# Come mettere il sito su WordPress (tema Astra)

Servono 6 file di questa cartella. Per copiarli: aprili con un editor di testo (Blocco note, TextEdit in modalità testo semplice, VS Code), seleziona tutto (Ctrl/Cmd+A) e copia.

## 1. Stili (una volta sola)
Aspetto > Personalizza > **CSS aggiuntivo**: cancella quello che c'è e incolla `00-CSS-aggiuntivo.css`. Premi Pubblica.

## 2. Home
1. Pagine > Aggiungi nuova. Titolo: `Home`.
2. Clicca il **+**, cerca **HTML personalizzato** e incolla tutto `01-home.html` (usa l'editor a blocchi, non quello classico).
3. Nella colonna destra apri **Impostazioni Astra** e imposta:
   - Disabilita: **Header**, **Titolo della pagina**, **Footer** (il sito ha già i suoi)
   - Layout contenitore: **Larghezza intera / Stretched**
   - Stile contenuto: **Unboxed**, Sidebar: **nessuna**
4. Pubblica. Poi Impostazioni > Lettura > "Una pagina statica" > Pagina iniziale: `Home`.

## 3. Pagine legali (stesse impostazioni Astra del punto 2)
| Titolo | Indirizzo (slug) | File |
|---|---|---|
| Informativa sulla privacy | `privacy` | `02-privacy.html` |
| Cookie policy | `cookie-policy` | `03-cookie-policy.html` |
| Note legali | `note-legali` | `04-note-legali.html` |

Gli indirizzi devono essere esattamente questi, perché il footer del sito rimanda a `/privacy/`, `/cookie-policy/` e `/note-legali/`.
Nelle note legali aggiungi il tuo indirizzo completo.

## 4. Pagina errore 404 (facoltativo)
Crea una pagina `Pagina non trovata` con `05-pagina-404.html` (stesse impostazioni Astra). Installa il plugin gratuito **404page** e in Aspetto > Pagina 404 scegli quella pagina.

## 5. SEO (plugin Yoast, in fondo a ogni pagina)
- Home: titolo `Web designer a Terracina (LT) – Siti web | Yousef Loulid`
  descrizione: vedi il tag description in `index.html` del repository
- Privacy: `Informativa sulla privacy | Yousef Loulid – Terracina (LT)`
- Cookie: `Cookie policy | Yousef Loulid – Terracina (LT)`
- Note legali: `Note legali | Yousef Loulid – Terracina (LT)`
- Pagina 404: imposta "noindex".

## 6. Icona del sito
Aspetto > Personalizza > Identità del sito > Icona del sito: carica `06-icona-sito-512.png`.

## Se qualcosa non va
- Lo script compare come testo: serve un account amministratore e l'editor a blocchi.
- Il sito sembra senza stili: controlla di aver incollato il CSS in "CSS aggiuntivo" e svuota la cache (plugin di cache, poi Ctrl+F5).
- Il 3D non si muove: escludi la pagina dalla minificazione/ritardo JavaScript del plugin di cache.
- Il vecchio sito Elementor: lascialo in bozza, non cancellarlo finché non hai controllato tutto.
