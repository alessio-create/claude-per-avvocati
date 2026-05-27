/**
 * Calendario "30 giorni per cambiare la pratica con Claude".
 *
 * Trenta azioni concrete, una al giorno, ognuna 5-30 minuti. Ogni giorno
 * produce un artefatto reale o uno skill che resta nello studio. Niente
 * giornate "informative" o di pura lettura: tutto è hands-on.
 *
 * Le sei settimane seguono una progressione: setup → drafting → skills →
 * projects → privacy → automazione.
 */

export type CategoriaGiorno =
  | 'Setup base'
  | 'Drafting'
  | 'Skills'
  | 'Projects'
  | 'Privacy & governance'
  | 'Automazione';

export interface GiornoCalendario {
  giorno: number;
  titolo: string;
  categoria: CategoriaGiorno;
  /** Minuti stimati per portarlo a termine. */
  tempo: number;
  /** Cosa fare, in modo concreto (50-90 parole). */
  cosa: string;
  /** Perché conta, perché vale i minuti spesi (20-40 parole). */
  perche: string;
  /** Eventuale link alla lezione del corso che tratta l'argomento. */
  link?: { label: string; href: string };
}

const C = {
  setup: 'Setup base' as const,
  draft: 'Drafting' as const,
  skill: 'Skills' as const,
  proj: 'Projects' as const,
  gov: 'Privacy & governance' as const,
  auto: 'Automazione' as const,
};

export const CATEGORIE_GIORNO: CategoriaGiorno[] = [
  'Setup base', 'Drafting', 'Skills', 'Projects', 'Privacy & governance', 'Automazione',
];

export const CATEGORIA_COLORE: Record<CategoriaGiorno, { bg: string; fg: string; ring: string }> = {
  'Setup base':            { bg: 'bg-[#e8defe]', fg: 'text-[#5e51a0]', ring: 'ring-[#5e51a0]/30' },
  'Drafting':              { bg: 'bg-[#fde2cc]', fg: 'text-[#b86b3f]', ring: 'ring-[#b86b3f]/30' },
  'Skills':                { bg: 'bg-[#d4ecdf]', fg: 'text-[#3c8a66]', ring: 'ring-[#3c8a66]/30' },
  'Projects':              { bg: 'bg-[#f4d4c4]', fg: 'text-[#a8512e]', ring: 'ring-[#a8512e]/30' },
  'Privacy & governance':  { bg: 'bg-[#d8e6dc]', fg: 'text-[#4f7a5f]', ring: 'ring-[#4f7a5f]/30' },
  'Automazione':           { bg: 'bg-[#dad4f0]', fg: 'text-[#5e51a0]', ring: 'ring-[#5e51a0]/30' },
};

export const CALENDARIO: GiornoCalendario[] = [
  /* ---------- Settimana 1, Setup base ---------- */
  {
    giorno: 1,
    titolo: 'Apri l\'account e fai un giro veloce',
    categoria: C.setup,
    tempo: 15,
    cosa: 'Crea un account su claude.ai (o conferma il Pro se già esistente). Apri Chat, Projects, Settings. Manda un primo prompt qualsiasi per familiarizzare con l\'output. Annota dove sta cosa: l\'orientamento del primo giorno conta più di quello che pensi.',
    perche: 'Senza una mappa minima dell\'interfaccia, ogni operazione successiva ti rallenta. 15 minuti di esplorazione ti risparmiano ore.',
    link: { label: 'Modulo 1, Lezione 1', href: '/corso/01-fondamenta/01-cosa-e-claude' },
  },
  {
    giorno: 2,
    titolo: 'Configura le Custom Instructions globali',
    categoria: C.setup,
    tempo: 30,
    cosa: 'Apri Settings, Profile, Custom Instructions. Scrivi il template del tuo studio: chi sei, stile (formule vietate, registro), firma, output di default. Salva. Apri una nuova Chat e verifica che il primo output rispetti automaticamente lo stile, senza specificarlo nel prompt.',
    perche: 'È il setup con il ROI più alto in assoluto. 30 minuti spesi una volta, beneficio su ogni conversazione futura del tuo account.',
    link: { label: 'Modulo 3, Custom Instructions', href: '/corso/03-setup-stile/02-custom-instructions' },
  },
  {
    giorno: 3,
    titolo: 'Anonimizza un caso reale e prova un prompt strutturato',
    categoria: C.setup,
    tempo: 20,
    cosa: 'Prendi un caso reale ma sostituisci nomi, P.IVA e importi precisi. Scrivi un prompt seguendo la formula Ruolo + Cliente + Caso + Task + Vincoli. Mandalo. Confronta l\'output con quello che otterresti scrivendo "scrivimi una bozza".',
    perche: 'La differenza visibile tra un prompt generico e uno strutturato è la prima evidenza concreta del valore. Senza questa esperienza, il corso resta astratto.',
    link: { label: 'Modulo 1, Prompt-base', href: '/corso/01-fondamenta/05-prompt-base-avvocato' },
  },
  {
    giorno: 4,
    titolo: 'Identifica il tuo cliente top e raccogli i suoi documenti',
    categoria: C.setup,
    tempo: 30,
    cosa: 'Scegli UN solo cliente: quello su cui torni più spesso. Raccogli 10-20 documenti rilevanti in una cartella locale: contratti chiave, atti, email importanti, eventuali pareri già emessi. Niente fascicolo intero: solo quello che useresti se dovessi spiegare il caso a un collega.',
    perche: 'Senza materiali pronti, il Project del Giorno 5 si arena prima di partire. Curare la selezione documenti è metà del lavoro.',
    link: { label: 'Modulo 2, Projects', href: '/corso/02-superfici/02-projects' },
  },
  {
    giorno: 5,
    titolo: 'Crea il primo Project (cliente reale)',
    categoria: C.setup,
    tempo: 45,
    cosa: 'Su claude.ai apri Projects, crea un nuovo Project per il cliente del Giorno 4. Scrivi le Custom Instructions specifiche (chi è, contesto, strategia). Carica i 10-20 documenti. Fai 3 domande di test al Project per verificare che il contesto sia compreso.',
    perche: 'Da domani questo Project sostituisce decine di copia-incolla nelle Chat. È il salto qualitativo dalla Chat sciolta al lavoro strutturato.',
    link: { label: 'Modulo 2, Projects', href: '/corso/02-superfici/02-projects' },
  },

  /* ---------- Settimana 2, Drafting ---------- */
  {
    giorno: 6,
    titolo: 'Prima messa in mora con Claude',
    categoria: C.draft,
    tempo: 25,
    cosa: 'Identifica una messa in mora vera che devi inviare (o ne sceglie una passata da rifare per esercizio). Usa il template del Modulo 1 lezione 5. Fai produrre la bozza a Claude. Rileggi, modifica due cose, e confronta col tempo che avresti impiegato a mano.',
    perche: 'È il task più ripetitivo e standardizzato per un civilista. Se Claude lo fa bene per la prima volta qui, lo farà bene 500 volte nella tua carriera futura.',
    link: { label: 'Modulo 4, Drafting atti', href: '/corso/04-casi-uso-legali/03-atti-drafting' },
  },
  {
    giorno: 7,
    titolo: 'Sintetizza una sentenza di Cassazione',
    categoria: C.draft,
    tempo: 15,
    cosa: 'Prendi una sentenza di Cassazione recente sulla tua materia (15-25 pagine va benissimo). Incollala in Claude. Chiedi una sintesi strutturata in 250 parole: inquadramento, decisione, principio di diritto, rilevanza. Verifica che ti dia subito quello che ti serve.',
    perche: 'Leggere in diagonale costa 25 minuti. Una sintesi mirata in 5 minuti ti dà più rapidamente la decisione: ti serve o non ti serve la sentenza.',
    link: { label: 'Modulo 4, Ricerca giurisprudenziale', href: '/corso/04-casi-uso-legali/04-ricerca-giurisprudenziale' },
  },
  {
    giorno: 8,
    titolo: 'Confronta due bozze di contratto',
    categoria: C.draft,
    tempo: 20,
    cosa: 'Prendi due versioni dello stesso contratto (es. una di una causa risolta, dove hai entrambe le bozze). Chiedi a Claude di produrre una tabella delle differenze rilevanti, colonna A vs B, e una preferenza motivata.',
    perche: 'Il diff tra contratti è un lavoro mentale costoso. Claude lo strutturà in 2 minuti e ti lascia il giudizio finale.',
    link: { label: 'Modulo 4, Revisione contratti', href: '/corso/04-casi-uso-legali/02-contratti-revisione' },
  },
  {
    giorno: 9,
    titolo: 'Genera 10 domande per il primo colloquio col cliente',
    categoria: C.draft,
    tempo: 15,
    cosa: 'Prendi un caso nuovo (anche ipotetico). Descrivi a Claude la situazione del cliente. Chiedi 10 domande chiave da fare al primo colloquio per capire se il caso è forte. Confrontale con quelle che avresti preparato tu.',
    perche: 'Le domande mancate al primo colloquio costano un mese di rilavorazione. Avere un check-list AI-generata aumenta la copertura iniziale.',
    link: { label: 'Modulo 4, Email cliente difficile', href: '/corso/04-casi-uso-legali/05-email-cliente-difficile' },
  },
  {
    giorno: 10,
    titolo: 'Riformula un\'email difficile in 3 toni diversi',
    categoria: C.draft,
    tempo: 10,
    cosa: 'Prendi un\'email difficile reale (contestazione parcella, rifiuto incarico, sollecito a contraparte). Chiedi a Claude di riformularla in 3 versioni: fermo-collaborativo, formale-distaccato, empatico-fermo. Scegli la migliore o componi.',
    perche: 'La versione "giusta" di un\'email delicata cambia a seconda del rapporto. Avere 3 versioni in 30 secondi cambia il modo in cui scegli.',
    link: { label: 'Modulo 4, Email cliente difficile', href: '/corso/04-casi-uso-legali/05-email-cliente-difficile' },
  },

  /* ---------- Settimana 3, Skills ---------- */
  {
    giorno: 11,
    titolo: 'Identifica il task più ripetuto della settimana',
    categoria: C.skill,
    tempo: 10,
    cosa: 'Guarda indietro le ultime 2 settimane. Quale task hai ripetuto almeno 3 volte? (Messa in mora? Email di sollecito? Sintesi di documenti?) Quello è il candidato per la tua prima Skill.',
    perche: 'Le Skills hanno valore solo se ripetute. Senza un candidato giusto, una Skill ben fatta resta scollegata dal workflow.',
    link: { label: 'Modulo 5, Anatomia di una Skill', href: '/corso/05-skills-repository/01-anatomia-skill' },
  },
  {
    giorno: 12,
    titolo: 'Scrivi la bozza della tua prima Skill',
    categoria: C.skill,
    tempo: 60,
    cosa: 'Apri un file `SKILL.md`. Compila: frontmatter (name, description), quando attivarla, cosa chiedere all\'utente, struttura output, vincoli di stile, esempi. Prendi spunto dalla skill `messa-in-mora` del Kit Modulo 10.',
    perche: 'Strutturare la Skill ti obbliga a esplicitare cose che fai a istinto. Quel processo da solo migliora la qualità del tuo workflow.',
    link: { label: 'Kit Skills installabili', href: '/corso/10-kit-pratico/02-skills-pronte-installazione' },
  },
  {
    giorno: 13,
    titolo: 'Prova la Skill su 3 casi reali, aggiusta',
    categoria: C.skill,
    tempo: 30,
    cosa: 'Attiva la Skill su 3 casi diversi della tua settimana. Annota dove l\'output cade corto: tono, lunghezza, mancanze. Aggiusta il SKILL.md fino a quando esce strutturalmente corretto al primo colpo (lasciandoti solo 1-2 micro-modifiche di tono).',
    perche: 'Una Skill non testata non vale niente. Il loop test-aggiusta è quello che la rende davvero affidabile.',
    link: { label: 'Modulo 5, Skill dello studio', href: '/corso/05-skills-repository/03-skill-studio' },
  },
  {
    giorno: 14,
    titolo: 'Documenta la Skill nel README dello studio',
    categoria: C.skill,
    tempo: 20,
    cosa: 'Crea (o aggiorna) un file `README.md` nella cartella `~/.claude/skills/` dello studio. Per ogni Skill installata, una riga: nome, scopo, quando attivarla, ultima revisione. Senza documentazione le Skills si perdono in 3 mesi.',
    perche: 'Le Skills senza documentazione invecchiano e nessuno le usa più. Un README di 5 righe per Skill ne triplica la vita utile.',
    link: { label: 'Modulo 5, Repository pubblici', href: '/corso/05-skills-repository/02-repository-pubblici' },
  },
  {
    giorno: 15,
    titolo: 'Costruisci la seconda Skill (stesso pattern)',
    categoria: C.skill,
    tempo: 45,
    cosa: 'Scegli il secondo task più ripetuto. Applica esattamente il pattern del Giorno 12: bozza, 3 test, aggiusta. Da qui in poi le Skill seguenti richiedono 30 minuti invece di 60 perché il pattern lo conosci.',
    perche: 'Una Skill è un esperimento, due sono un metodo. Costruire la seconda valida il pattern come tuo, non come "una cosa del corso".',
  },

  /* ---------- Settimana 4, Projects ---------- */
  {
    giorno: 16,
    titolo: 'Crea Project per il secondo cliente top',
    categoria: C.proj,
    tempo: 40,
    cosa: 'Ripeti il setup del Giorno 5 sul secondo cliente in ordine di frequenza. Custom Instructions specifiche, 10-15 documenti, 3 domande di prova. Da ora hai 2 contesti persistenti pronti per ogni domanda.',
    perche: 'Un Project dimostra il pattern. Due dimostrano che è scalabile. Il salto da uno a tre Project è dove cambia davvero la giornata.',
    link: { label: 'Modulo 2, Projects', href: '/corso/02-superfici/02-projects' },
  },
  {
    giorno: 17,
    titolo: 'Definisci una convenzione naming per i Project',
    categoria: C.proj,
    tempo: 15,
    cosa: 'Decidi una convenzione: es. `[A/B/C]-[ClienteID]-[Descrizione]` (la categoria privacy come prefisso). Rinomina i Project esistenti per allinearli. Documentala nella `STUDIO-AI-POLICY.md` (la scriverai al Giorno 21).',
    perche: 'Senza convenzione, in 3 mesi avrai 50 Project con nomi inconsistenti. Definirla ora costa 15 minuti, dopo costa una giornata di pulizia.',
    link: { label: 'Modulo 7, Governance Cowork', href: '/corso/07-cowork/04-governance-cowork' },
  },
  {
    giorno: 18,
    titolo: 'Riordina lo storico di un cliente con Claude',
    categoria: C.proj,
    tempo: 30,
    cosa: 'Apri il Project di un cliente. Chiedi: "ricostruisci una cronologia degli eventi degli ultimi 12 mesi dai documenti caricati, in tabella". Verifica e aggiusta. La cronologia diventa parte del Project come documento permanente.',
    perche: 'Una cronologia pulita risparmia 5 minuti per ogni nuova domanda futura su quel cliente. Su 6 mesi di interazione, sono ore.',
  },
  {
    giorno: 19,
    titolo: 'Genera un report mensile dal Project',
    categoria: C.proj,
    tempo: 30,
    cosa: 'Chiedi al Project di generare un riepilogo: cosa è successo nelle ultime 4 settimane, decisioni prese, prossimi passi, tempo speso (se l\'hai loggato). Da mandare al cliente o tenere come traccia interna.',
    perche: 'Il report mensile è un\'attività che valorizza il lavoro fatto. Spesso non si fa perché costa 2 ore di rielaborazione. Con un Project ben fatto sono 30 minuti.',
  },
  {
    giorno: 20,
    titolo: 'Insegna a un collega a usare un Project',
    categoria: C.proj,
    tempo: 30,
    cosa: 'Chiama un collega dello studio. Mostra come hai configurato un Project. Lascialo fare uno suo per un suo cliente, sotto il tuo sguardo. 30 minuti di affiancamento ti raddoppiano il valore generato.',
    perche: 'Le competenze AI non scalano da sole nello studio. Servono trasferimenti uno-a-uno, brevi, frequenti. Il primo è il più importante.',
  },

  /* ---------- Settimana 5, Privacy & governance ---------- */
  {
    giorno: 21,
    titolo: 'Scrivi STUDIO-AI-POLICY.md in 2 pagine',
    categoria: C.gov,
    tempo: 90,
    cosa: 'Apri un file `STUDIO-AI-POLICY.md`. 4 sezioni: strumenti approvati, classificazione dati A/B/C, workflow obbligatori (anonimizzazione, verifica output, citazione giurisprudenza), conseguenze violazioni. Max 2 pagine. Stampa e fai firmare a tutti i collaboratori.',
    perche: 'Senza policy scritta, il primo errore di compliance è ambiguo. Con la policy, la responsabilità è chiara: il documento spiega cosa si doveva fare.',
    link: { label: 'Modulo 6, Configurazione a norma', href: '/corso/06-privacy-deontologia/02-configurazione-a-norma' },
  },
  {
    giorno: 22,
    titolo: 'Aggiorna il registro dei trattamenti GDPR',
    categoria: C.gov,
    tempo: 45,
    cosa: 'Apri il registro dei trattamenti (art. 30 GDPR) dello studio. Aggiungi la voce "Assistenza alla redazione di atti e pareri tramite AI generativa": base giuridica, categorie di dati, conservazione (30 giorni), trasferimenti extra-UE. Se non hai un registro, è il momento di farlo.',
    perche: 'Un registro non aggiornato è una violazione formale. Aggiornarlo ora costa 45 minuti; farlo durante un\'ispezione costa molto di più.',
    link: { label: 'Glossario, Registro trattamenti', href: '/corso/glossario#registro-trattamenti' },
  },
  {
    giorno: 23,
    titolo: 'Configura livelli di accesso (se sei admin)',
    categoria: C.gov,
    tempo: 30,
    cosa: 'Se sei admin di Cowork, mappa chi ha accesso a quali Project. Crea una matrice ruolo → accesso → tipo dato. Revoca accessi a chi non li usa più. Audit log: controlla accessi anomali.',
    perche: 'In 6 mesi di Cowork accumuli accessi orfani. Una pulizia mensile mantiene il workspace sotto controllo e riduce la superficie di rischio.',
    link: { label: 'Modulo 7, Setup Cowork', href: '/corso/07-cowork/02-setup-cowork' },
  },
  {
    giorno: 24,
    titolo: 'Pianifica il primo audit settimanale',
    categoria: C.gov,
    tempo: 15,
    cosa: 'Metti in calendario un appuntamento settimanale ricorrente di 5 minuti: "audit AI". Cosa controlli: quanti Project nuovi sono stati creati la settimana? Ci sono dati di Categoria C dove non dovrebbero stare? Skill nuove condivise?',
    perche: '5 minuti a settimana ti danno il polso. Senza audit ricorrenti, gli errori di compliance si scoprono solo quando già sono problemi.',
  },
  {
    giorno: 25,
    titolo: 'Discuti la policy nel prossimo meeting di studio',
    categoria: C.gov,
    tempo: 30,
    cosa: 'Nel prossimo meeting settimanale dello studio, dedica 30 minuti alla policy AI. Distribuisci copia stampata. Discuti i casi grigi (cosa è Categoria B vs C in pratica? Come anonimizzare bene?). Raccogli dubbi.',
    perche: 'Una policy non discussa resta inerte. La discussione esplicita è quello che la rende un asset condiviso dello studio.',
  },

  /* ---------- Settimana 6, Automazione ---------- */
  {
    giorno: 26,
    titolo: 'Installa Claude Code',
    categoria: C.auto,
    tempo: 20,
    cosa: 'Installa Node.js da nodejs.org se non l\'hai. Apri terminale e installa Claude Code: `npm install -g @anthropic-ai/claude-code`. Autenticati con `claude`. Fai un giro veloce dei comandi base.',
    perche: 'Code è incluso nel Pro che già paghi. Non installarlo è lasciare valore sul tavolo. 20 minuti per aprire la porta a tutto il Modulo 8.',
    link: { label: 'Modulo 8, Installazione', href: '/corso/08-code-per-avvocati/02-installazione-primi-comandi' },
  },
  {
    giorno: 27,
    titolo: 'Riorganizza un fascicolo con Code',
    categoria: C.auto,
    tempo: 60,
    cosa: 'Lavora su una COPIA di un fascicolo (mai sull\'originale, mai). Apri Claude Code nella cartella copia. Chiedi: mappa, poi rinominazione `YYYY-MM-DD_categoria_descrizione`, poi cronologia. Approva ogni operazione manualmente le prime 10 volte.',
    perche: 'Una volta visto Code lavorare su 200 file in 30 minuti, il concetto di "1 ora per ordinare la cartella" sembra primitivo. Cambia la baseline.',
    link: { label: 'Modulo 8, Perché Code', href: '/corso/08-code-per-avvocati/01-perche-code-anche-per-te' },
  },
  {
    giorno: 28,
    titolo: 'Setup del primo Schedule (riepilogo lunedì)',
    categoria: C.auto,
    tempo: 45,
    cosa: 'Crea una Skill `report-lunedi` che legge `/pratiche/in-corso/`, identifica scadenze e pratiche ferme. Configura lo Schedule: `claude schedule add --skill report-lunedi --cron "30 7 * * 1"`. Lascia girare e ricevi il primo report il prossimo lunedì.',
    perche: 'Lunedì mattina alle 9 ti svegli con il report già pronto. È il momento in cui Claude smette di essere "uno strumento" e diventa "un collega che non dorme".',
    link: { label: 'Modulo 9, Schedule', href: '/corso/09-app-e-schedule/02-schedule-task-programmati' },
  },
  {
    giorno: 29,
    titolo: 'Costruisci la libreria di Skills condivise dello studio',
    categoria: C.auto,
    tempo: 60,
    cosa: 'Crea una cartella `~/Studio-Skills/` (o repository Git privato su GitHub se siete tecnici). Raccogli tutte le Skill costruite dal Giorno 12 al 15. Aggiungi il README. Condividi l\'accesso ai colleghi. Definisci chi è "manutentore" di ciascuna.',
    perche: 'Le Skills smettono di essere "le tue" e diventano "dello studio" solo quando c\'è una libreria condivisa con responsabili chiari.',
    link: { label: 'Modulo 5, Condividere Skills', href: '/corso/05-skills-repository/04-condividere-skills' },
  },
  {
    giorno: 30,
    titolo: 'Misura il tempo recuperato e celebra',
    categoria: C.auto,
    tempo: 30,
    cosa: 'Apri un foglio Excel. Scrivi per ogni tipologia di task (messa in mora, sintesi, parere, ecc.) il tempo medio PRIMA del corso e DOPO 30 giorni. Somma. Moltiplica per la tariffa interna. Quello è il valore generato dal mese di pratica.',
    perche: 'Misurare il risultato concretizza l\'investimento. È quello che ti farà continuare nei prossimi 6 mesi quando la curiosità iniziale si sarà spenta.',
    link: { label: 'Certificazione finale', href: '/corso/certificazione' },
  },
];
