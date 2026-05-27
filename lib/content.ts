import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';

export type CoverColor = 'lilac' | 'sage' | 'peach' | 'lavender' | 'terracotta' | 'mint';
export type ModuleIconName = 'fondamenta' | 'surfaces' | 'setup' | 'legal' | 'skills' | 'privacy' | 'cowork' | 'code' | 'app-schedule' | 'kit';

export interface ModuleMeta {
  titolo: string;
  sottotitolo: string;
  ordine: number;
  categoria: string;
  icona: ModuleIconName;
  coloreCover: CoverColor;
  /** Planned lesson count shown on the marketing card even before lessons are authored. */
  lezioniPianificate: number;
  /** Planned total minutes shown on the marketing card. */
  durataMinutiPianificati: number;
  /** Bonus modules sit outside the core path; unlock with gems instead of progression. */
  bonus?: boolean;
  /** Gem cost to unlock a bonus module. Only read when `bonus === true`. */
  costoGemme?: number;
}

export interface LessonMeta {
  titolo: string;
  sottotitolo: string;
  durata: number;
  ordine: number;
  aggiornato: string;
  quiz: boolean;
  /** 'esame' marks the end-of-module exam (renders distinctly, gates next module). */
  tipo?: 'lezione' | 'esame';
}

export interface Lesson extends LessonMeta {
  slug: string;
}

export interface Module extends ModuleMeta {
  slug: string;
  lezioni: Lesson[];
}

export interface CorsoIndex {
  moduli: Module[];
}

export function buildCorsoIndex(root: string): CorsoIndex {
  if (!existsSync(root)) throw new Error(`Content root not found: ${root}`);

  const moduli: Module[] = [];
  const moduleDirs = readdirSync(root)
    .filter((name) => {
      const p = join(root, name);
      return statSync(p).isDirectory();
    })
    .sort();

  for (const dir of moduleDirs) {
    const dirPath = join(root, dir);
    const metaPath = join(dirPath, '_module.json');
    if (!existsSync(metaPath)) throw new Error(`Missing _module.json in ${dirPath}`);
    const meta = JSON.parse(readFileSync(metaPath, 'utf8')) as ModuleMeta;

    const lessons: Lesson[] = readdirSync(dirPath)
      .filter((f) => f.endsWith('.mdx'))
      .sort()
      .map((file) => {
        const slug = file.replace(/\.mdx$/, '');
        const raw = readFileSync(join(dirPath, file), 'utf8');
        const { data } = matter(raw);
        return { slug, ...(data as LessonMeta) };
      })
      .sort((a, b) => a.ordine - b.ordine);

    moduli.push({ slug: dir, lezioni: lessons, ...meta });
  }

  moduli.sort((a, b) => a.ordine - b.ordine);
  return { moduli };
}

const CONTENT_ROOT = join(process.cwd(), 'content', 'corso');
let cached: CorsoIndex | null = null;
export function getCorsoIndex(): CorsoIndex {
  if (!cached) cached = buildCorsoIndex(CONTENT_ROOT);
  return cached;
}
