/**
 * Glossario del corso "Claude per Avvocati".
 *
 * 30 termini in quattro categorie. Definizioni pensate per l'avvocato civilista
 * italiano: sempre orientate alla pratica, mai accademiche.
 *
 * Ogni voce ha:
 *  - `slug`: usato come anchor URL (`/corso/glossario#prompt`)
 *  - `termine`: forma canonica
 *  - `aliases`: forme alternative cercabili (singolare/plurale/sigla)
 *  - `categoria`: una delle quattro categorie
 *  - `definizione`: testo principale (60-120 parole)
 *  - `vediAnche`: link interni opzionali ad altri termini o moduli del corso
 */

export type GlossarioCategoria =
  | 'Tecnologia e prodotto'
  | 'Diritto e compliance'
  | 'Pratica avvocatizia'
  | 'Concetti del corso';

export interface VoceGlossario {
  slug: string;
  termine: string;
  aliases?: string[];
  categoria: GlossarioCategoria;
  definizione: string;
  vediAnche?: { label: string; href: string }[];
}

export const GLOSSARIO: VoceGlossario[] = [
  /* ------------------------------------------------------------------ */
  /*  TECNOLOGIA E PRODOTTO                                             */
  /* ------------------------------------------------------------------ */
  {
    slug: 'anthropic',
    termine: 'Anthropic',
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Società americana fondata nel 2021 a San Francisco che sviluppa Claude. Per lo studio italiano è il responsabile esterno del trattamento ai sensi del GDPR quando si firma un DPA tramite il piano Cowork. Si distingue per un approccio "safety-first" all\'AI, di rilievo deontologico perché significa meno comportamenti aggressivi/imprevedibili del modello in casi sensibili.',
    vediAnche: [
      { label: 'DPA', href: '#dpa' },
      { label: 'Cowork', href: '#cowork' },
    ],
  },
  {
    slug: 'modello',
    termine: 'Modello (Opus, Sonnet, Haiku)',
    aliases: ['opus', 'sonnet', 'haiku', 'modello claude'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Le tre famiglie di modelli Claude: Opus (massima capacità, più lento e costoso, ideale per pareri complessi), Sonnet (equilibrio tra capacità e velocità, default per la maggior parte degli usi), Haiku (rapido ed economico, ideale per task ripetitivi semplici). Ogni famiglia ha versioni numerate (es. 4.6, 4.7). Per uno studio civilista la scelta tipica è Sonnet come default + Opus quando il task è strategico.',
  },
  {
    slug: 'token',
    termine: 'Token',
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Unità minima di testo elaborata dal modello: un pezzo di parola, una parola corta intera, un segno di punteggiatura. Per l\'italiano, una pagina A4 di testo equivale grossomodo a 600-800 token. Il prezzo dell\'API e i limiti di contesto si misurano in token, non in parole. Per l\'avvocato è utile saperlo perché un contratto da 40 pagine occupa ~30.000 token: rientra nei limiti dei modelli moderni ma è un ordine di grandezza da tenere a mente.',
  },
  {
    slug: 'contesto',
    termine: "Contesto (context window)",
    aliases: ['context window', 'finestra di contesto'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'La quantità massima di testo che il modello può "tenere in mente" durante una conversazione, espressa in token. Le versioni moderne di Claude offrono finestre di 200.000+ token, abbastanza per caricare interi fascicoli di pratica. Quando il contesto si satura, il modello inizia a "dimenticare" le prime parti della conversazione. Per gli avvocati: i Project sono il modo migliore per gestire il contesto su pratiche lunghe.',
    vediAnche: [{ label: 'Project', href: '#project' }],
  },
  {
    slug: 'prompt',
    termine: 'Prompt',
    categoria: 'Tecnologia e prodotto',
    definizione:
      'L\'istruzione testuale che l\'utente fornisce a Claude. Per uno studio legale un prompt utile contiene quattro elementi: ruolo (chi sei tu, Claude), task specifico (cosa devi fare), vincoli (tono, lunghezza, divieti) e contesto (fatti, parti, importi). Un prompt generico produce un output generico; un prompt strutturato secondo questi quattro elementi produce una bozza usabile in 1-2 iterazioni. Tutto il Modulo 1 del corso è dedicato a costruirli bene.',
    vediAnche: [{ label: 'Modulo 1', href: '/corso/01-fondamenta/01-cosa-e-claude' }],
  },
  {
    slug: 'allucinazione',
    termine: 'Allucinazione',
    aliases: ['hallucination', 'allucinazioni'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Il fenomeno per cui il modello produce informazioni plausibili ma false: nomi di sentenze inesistenti, articoli del codice mai scritti, citazioni inventate. Per l\'avvocato è il rischio professionale principale: una citazione di Cassazione allucinata e depositata in atti può configurare violazioni deontologiche e responsabilità professionale. Mitigazione: nei prompt vietare esplicitamente la citazione di specifici numeri di sentenze (lasciando solo riferimenti generici tipo "secondo l\'orientamento prevalente") e verificare sempre su banca dati.',
    vediAnche: [{ label: 'Modulo 6', href: '/corso/06-privacy-deontologia/01-cosa-puoi-mandare' }],
  },
  {
    slug: 'custom-instructions',
    termine: 'Custom Instructions',
    aliases: ['istruzioni personalizzate', 'custom instruction'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Campo di testo persistente (max ~3.000 caratteri) impostato a livello di account o di Project, letto da Claude prima di ogni nuova conversazione. È il posto giusto dove definire stile dello studio, formule vietate, firma standard, registro linguistico. Una volta configurate, ogni conversazione futura le eredita automaticamente. Tra tutti i setup il Custom Instructions ha il ROI più alto: 30 minuti spesi una volta, valore su migliaia di conversazioni.',
    vediAnche: [{ label: 'Modulo 3', href: '/corso/03-setup-stile/02-custom-instructions' }],
  },
  {
    slug: 'project',
    termine: 'Project (Claude Projects)',
    aliases: ['projects', 'progetti claude'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Cartella persistente che raccoglie documenti caricati + Custom Instructions specifiche + storico delle conversazioni su un singolo cliente o pratica. A differenza della Chat semplice, un Project "ricorda" tutto: Claude vede i documenti del fascicolo, lo stile dello studio, le conversazioni precedenti. Il pattern raccomandato è "un Project per cliente attivo": 30 minuti di setup, valore continuo. Vedi Blog "Un Project per cliente".',
    vediAnche: [
      { label: 'Modulo 2', href: '/corso/02-superfici/02-projects' },
      { label: 'Blog Projects', href: '/blog/11-projects-claude-uno-per-cliente' },
    ],
  },
  {
    slug: 'skill',
    termine: 'Skill (Claude Skills)',
    aliases: ['skills', 'claude skill'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Procedura riusabile definita in un file `SKILL.md` con frontmatter, regole di attivazione, struttura dell\'output e divieti. Quando attivata, Claude segue le istruzioni della Skill come un workflow predefinito. Per uno studio è la differenza tra "riscrivere il prompt della messa in mora ogni volta" e "richiamare la skill messa-in-mora con tre parametri". Le Skills sono versionabili, condivisibili tra collaboratori, e formano la libreria operativa dello studio.',
    vediAnche: [
      { label: 'Modulo 5', href: '/corso/05-skills-repository/01-anatomia-skill' },
      { label: 'Kit Skills', href: '/corso/10-kit-pratico/02-skills-pronte-installazione' },
    ],
  },
  {
    slug: 'mcp',
    termine: 'MCP (Model Context Protocol)',
    aliases: ['model context protocol'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Standard aperto introdotto da Anthropic che permette a Claude di connettersi a sistemi esterni (gestionali, Drive, Outlook, banche dati interne). Per uno studio significa: Claude può leggere direttamente i fascicoli nel gestionale, le email, i calendari, senza richiedere copy-paste. Setup non banale: richiede installazione di un "server MCP" che fa da ponte tra Claude e il sistema target. Tipicamente il piano Studio del corso include un setup MCP di base per il gestionale.',
    vediAnche: [{ label: 'Modulo 2', href: '/corso/02-superfici/05-mcp' }],
  },
  {
    slug: 'api',
    termine: 'API',
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Interfaccia programmatica per integrare Claude in applicazioni custom dello studio (un sito di prenotazione consulenze, uno script di analisi documentale, un chatbot interno). Si paga a consumo, in token. Per la maggior parte degli avvocati l\'API non è necessaria: claude.ai + Code coprono il 95% dei casi. Diventa rilevante quando si vuole costruire automazioni profonde o integrazioni con strumenti dello studio.',
    vediAnche: [{ label: 'Modulo 2', href: '/corso/02-superfici/06-api' }],
  },
  {
    slug: 'claude-code',
    termine: 'Claude Code',
    aliases: ['code'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Versione di Claude che vive nel terminale del tuo computer e può leggere, scrivere e organizzare file direttamente (con il tuo permesso). Cambia in modo radicale i workflow su molti file: riorganizzare un fascicolo da 300 documenti, estrarre dati da 40 contratti, generare report ricorrenti. Si installa con `npm install -g @anthropic-ai/claude-code` (richiede Node.js). Incluso nei piani Pro e Max di Claude, non richiede abbonamento separato.',
    vediAnche: [{ label: 'Modulo 8', href: '/corso/08-code-per-avvocati/01-perche-code-anche-per-te' }],
  },
  {
    slug: 'schedule',
    termine: 'Schedule (cron)',
    aliases: ['cron', 'task programmati'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Funzione di Claude Code che permette di eseguire una Skill su base periodica (es. ogni lunedì alle 7:30). Per uno studio significa report automatizzati senza intervento manuale: il riepilogo settimanale delle scadenze, il monitoraggio della Gazzetta Ufficiale, le bozze di fattura del mese. Usa la sintassi cron standard (`30 7 * * 1` = lunedì 7:30). Non delegate a Schedule decisioni di giudizio: solo estrazione, monitoraggio, reporting.',
    vediAnche: [{ label: 'Modulo 9', href: '/corso/09-app-e-schedule/02-schedule-task-programmati' }],
  },
  {
    slug: 'cowork',
    termine: 'Cowork (Claude for Work)',
    aliases: ['claude for work', 'claude team'],
    categoria: 'Tecnologia e prodotto',
    definizione:
      'Piano di Claude pensato per le organizzazioni: workspace condiviso, gestione accessi centralizzata, DPA firmato a livello di organizzazione, audit log. Per uno studio con 3+ persone è il setup conforme da scegliere se si lavora regolarmente su dati di Categoria B/C. Costo: €25-30 per utente al mese (con minimi). I prompt non vengono usati per addestrare i modelli e l\'admin del workspace è il titolare del trattamento.',
    vediAnche: [{ label: 'Modulo 7', href: '/corso/07-cowork/01-cosa-e-cowork' }],
  },

  /* ------------------------------------------------------------------ */
  /*  DIRITTO E COMPLIANCE                                              */
  /* ------------------------------------------------------------------ */
  {
    slug: 'gdpr',
    termine: 'GDPR (Reg. UE 2016/679)',
    aliases: ['regolamento generale protezione dati'],
    categoria: 'Diritto e compliance',
    definizione:
      'Il Regolamento generale sulla protezione dei dati personali, applicato direttamente in Italia dal 25 maggio 2018. Per uno studio che integra Claude rilevano in particolare: l\'art. 25 (privacy by design), l\'art. 28 (responsabile esterno), l\'art. 30 (registro dei trattamenti), gli artt. 32-34 (sicurezza e gestione data breach). Ogni uso di Claude su dati di clienti reali deve essere mappato sulle base giuridiche del Regolamento.',
  },
  {
    slug: 'ai-act',
    termine: 'AI Act (Reg. UE 2024/1689)',
    aliases: ['regolamento ai', 'ai act europeo'],
    categoria: 'Diritto e compliance',
    definizione:
      'Regolamento europeo sull\'AI in fase di applicazione (entrata in vigore agosto 2024, applicazione graduale fino al 2027). Classifica i sistemi AI per livello di rischio. Per gli utilizzatori finali (uno studio legale) le obbligazioni più stringenti sono limitate; i fornitori (es. Anthropic) hanno obblighi più pesanti. Vale la pena monitorare l\'evoluzione applicativa: lo studio non è "fornitore" ma resta "utilizzatore" con obblighi di trasparenza nei confronti del cliente.',
  },
  {
    slug: 'dpa',
    termine: 'DPA (Data Processing Agreement)',
    aliases: ['accordo trattamento dati'],
    categoria: 'Diritto e compliance',
    definizione:
      'Contratto ex art. 28 GDPR tra titolare (lo studio) e responsabile esterno (Anthropic), che disciplina formalmente il trattamento dei dati personali da parte del responsabile. Per Claude Cowork il DPA è disponibile come modello standard e si firma a livello di workspace. Tipicamente 12-15 pagine. Va letto, eventualmente integrato con clausole specifiche dello studio (es. obblighi di notifica più stringenti), e firmato PRIMA di iniziare a usare Claude su dati di cliente.',
  },
  {
    slug: 'anonimizzazione',
    termine: 'Anonimizzazione',
    categoria: 'Diritto e compliance',
    definizione:
      'Trattamento che rende impossibile (non solo difficile) ricondurre il dato al soggetto. Per i prompt a Claude significa: rimuovere nomi, P.IVA, indirizzi specifici, sostituire importi precisi con range. Attenzione: l\'anonimizzazione del nome non basta se il contesto identifica comunque il cliente (es. "la srl tessile di 30 dipendenti a Como"). Vedi anche pseudonimizzazione, che è una tecnica diversa, più debole ma utile.',
    vediAnche: [{ label: 'Pseudonimizzazione', href: '#pseudonimizzazione' }],
  },
  {
    slug: 'pseudonimizzazione',
    termine: 'Pseudonimizzazione',
    categoria: 'Diritto e compliance',
    definizione:
      'Trattamento che impedisce di identificare il soggetto senza informazioni aggiuntive tenute separate (es. tabella di mappatura "Cliente A → nome reale" custodita offline). Non è anonimizzazione: ai fini GDPR il dato pseudonimizzato resta dato personale. Per i prompt Claude è una tecnica utile come livello intermedio: usi "Cliente A" nei prompt, mantieni la mappatura nel tuo gestionale.',
    vediAnche: [{ label: 'Anonimizzazione', href: '#anonimizzazione' }],
  },
  {
    slug: 'registro-trattamenti',
    termine: 'Registro dei trattamenti (art. 30 GDPR)',
    categoria: 'Diritto e compliance',
    definizione:
      'Documento obbligatorio (con eccezioni per micro-organizzazioni) che mappa tutti i trattamenti di dati personali effettuati dallo studio. Per chi integra Claude va aggiunta una voce dedicata che indichi: categoria di trattamento (assistenza tramite AI generativa), base giuridica, categorie di dati, conservazione (es. 30 giorni su Cowork), misure di sicurezza, eventuali trasferimenti extra-UE.',
  },
  {
    slug: 'titolare-trattamento',
    termine: 'Titolare del trattamento',
    categoria: 'Diritto e compliance',
    definizione:
      'Soggetto che determina le finalità e le modalità del trattamento dei dati personali. Per uno studio legale che usa Claude, è lo studio stesso (P.IVA). Anthropic è invece "responsabile esterno" del trattamento. La distinzione conta in caso di breach: chi notifica al Garante è il titolare (lo studio), non il responsabile (Anthropic).',
    vediAnche: [{ label: 'Responsabile esterno', href: '#responsabile-esterno' }],
  },
  {
    slug: 'responsabile-esterno',
    termine: 'Responsabile esterno',
    categoria: 'Diritto e compliance',
    definizione:
      'Ai sensi dell\'art. 28 GDPR, soggetto che tratta dati personali per conto del titolare in base a contratto (DPA). Nel rapporto avvocato/Claude, Anthropic agisce come responsabile esterno: tratta dati per conto dello studio, non per finalità proprie. Il DPA disciplina obblighi, durata, misure di sicurezza, sub-responsabili, modalità di notifica delle violazioni.',
    vediAnche: [
      { label: 'Titolare', href: '#titolare-trattamento' },
      { label: 'DPA', href: '#dpa' },
    ],
  },
  {
    slug: 'segreto-professionale',
    termine: 'Segreto professionale (art. 622 c.p., art. 13 CDF)',
    categoria: 'Diritto e compliance',
    definizione:
      'Obbligo deontologico dell\'avvocato di mantenere riservate le informazioni apprese dal cliente, presidiato sia penalmente (art. 622 c.p.) sia deontologicamente (art. 13 Codice Deontologico Forense). Per l\'uso di Claude implica: dati di Categoria C (penale, sanitari sensibili, NDA stretti) non vanno inviati su strumenti consumer; per dati di Categoria B serve almeno Cowork con DPA firmato; per Categoria A nessun vincolo specifico.',
    vediAnche: [{ label: 'Codice Deontologico Forense', href: '#cdf' }],
  },
  {
    slug: 'cdf',
    termine: 'Codice Deontologico Forense (CDF)',
    aliases: ['codice deontologico forense', 'codice deontologico'],
    categoria: 'Diritto e compliance',
    definizione:
      'Insieme delle norme deontologiche cui sono soggetti gli avvocati italiani, aggiornato periodicamente dal CNF. Per chi integra AI nel workflow rilevano in particolare: l\'art. 12 (diligenza), l\'art. 13 (segreto professionale e riserbo), l\'art. 27 (informazioni sull\'attività professionale), l\'art. 28 (riservatezza e segreto). Le pronunce del CNF in materia di AI sono in via di consolidamento.',
  },

  /* ------------------------------------------------------------------ */
  /*  PRATICA AVVOCATIZIA                                               */
  /* ------------------------------------------------------------------ */
  {
    slug: 'messa-in-mora',
    termine: 'Messa in mora (art. 1219 c.c.)',
    categoria: 'Pratica avvocatizia',
    definizione:
      'Atto formale con cui il creditore intima al debitore l\'adempimento, costituendolo in mora e attivando gli effetti dell\'art. 1219 c.c. (decorrenza interessi moratori, perpetuatio obligationis, ecc.). Tipicamente inviata via PEC, è uno dei task più ricorrenti per uno studio civilista (2-3 a settimana in media) e perfetto candidato per una Skill dedicata. Il corso include una Skill `messa-in-mora` pronta all\'uso.',
    vediAnche: [{ label: 'Skill messa-in-mora', href: '/corso/10-kit-pratico/02-skills-pronte-installazione' }],
  },
  {
    slug: 'decreto-ingiuntivo',
    termine: 'Decreto ingiuntivo (art. 633 c.p.c.)',
    categoria: 'Pratica avvocatizia',
    definizione:
      'Provvedimento monitorio del giudice ottenuto su ricorso del creditore in possesso di prova scritta del credito. Nelle messe in mora viene tipicamente menzionato come deterrente ("decorso inutilmente il termine si procederà per decreto ingiuntivo ex art. 633 c.p.c."). Quando si redige una messa in mora con una Skill, l\'avvertimento sul decreto ingiuntivo è uno dei punti standard della struttura.',
  },
  {
    slug: 'clausole-vessatorie',
    termine: 'Clausole vessatorie (art. 1341 c.c., art. 33 cod. cons.)',
    categoria: 'Pratica avvocatizia',
    definizione:
      'Clausole contrattuali che richiedono specifica approvazione per iscritto ai sensi dell\'art. 1341 c.c. (B2B) o ricadono nella disciplina di tutela del consumatore (art. 33 cod. cons. e segg., B2C). In una revisione preventiva di contratto è uno dei controlli prioritari: la Skill `revisione-contratto` del kit le verifica esplicitamente.',
  },
  {
    slug: 'pec',
    termine: 'PEC (Posta Elettronica Certificata)',
    aliases: ['posta elettronica certificata'],
    categoria: 'Pratica avvocatizia',
    definizione:
      'Sistema di posta elettronica con valore legale equiparabile alla raccomandata A/R. Per uno studio è il canale standard per invii di valore (messe in mora, atti del processo civile telematico). Una Skill che produce una messa in mora deve generare output "PEC-ready": testo pulito, niente formattazione esotica, possibilità di copia-incolla senza perdere accapi.',
  },

  /* ------------------------------------------------------------------ */
  /*  CONCETTI DEL CORSO                                                */
  /* ------------------------------------------------------------------ */
  {
    slug: 'categoria-dati',
    termine: 'Categoria di dati (A / B / C)',
    aliases: ['categoria a', 'categoria b', 'categoria c', 'classificazione dati'],
    categoria: 'Concetti del corso',
    definizione:
      'Classificazione introdotta nel corso per orientare la scelta degli strumenti AI: A = dati liberi (modelli, formule, prompt-template), B = dati di cliente anonimizzati o non identificabili (ok su Pro singolo con cautela, ok su Cowork senza limiti), C = dati di cliente identificabili o sensibili (solo Cowork con DPA firmato, mai su account consumer). Tutta la policy interna allo studio si basa su questa classificazione.',
    vediAnche: [{ label: 'Modulo 6', href: '/corso/06-privacy-deontologia/01-cosa-puoi-mandare' }],
  },
  {
    slug: 'gemma',
    termine: 'Gemma (✦)',
    aliases: ['gemme', 'gem', 'gems'],
    categoria: 'Concetti del corso',
    definizione:
      'Unità di progresso del corso. Si guadagnano: 1 ✦ per ogni lezione letta, 3 ✦ per ogni esame/verifica superata, 10 ✦ per ogni modulo completato (tutti gli esami passati), 50 ✦ per la certificazione finale. Le gemme servono a sbloccare i quattro moduli bonus (M7 Cowork, M8 Code, M9 App+Schedule, M10 Kit). Vivono in localStorage del browser: identità per device, no server-side.',
  },
  {
    slug: 'pioneer',
    termine: 'Pioneer (Livello 5)',
    aliases: ['pioniere', 'livello 5'],
    categoria: 'Concetti del corso',
    definizione:
      'Stato finale del percorso, raggiunto quando tutti i moduli core (M1-M6) sono completati, tutti gli esami superati, e la certificazione finale ottenuta. Corrisponde al "Livello 5" della piramide del meccanismo (libero dal grezzo → libero dalla burocrazia → libero dal sovraccarico → libero di pensare → Pioniere). Visualizzato con un badge dedicato e una hero card sulla pagina indice del corso.',
  },
];

export const GLOSSARIO_CATEGORIE: GlossarioCategoria[] = [
  'Tecnologia e prodotto',
  'Diritto e compliance',
  'Pratica avvocatizia',
  'Concetti del corso',
];
