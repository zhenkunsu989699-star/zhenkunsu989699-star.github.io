import { getCollection, type CollectionEntry } from 'astro:content';

export type Paper = CollectionEntry<'papers'>;

export async function getPapers() {
  const all = await getCollection('papers');
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getNotes() {
  const all = await getCollection('notes', (n) => import.meta.env.DEV || !n.data.draft);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 出处：期刊, 年(期): 页码 */
export function venueLine(p: Paper['data']) {
  let s = `${p.venue}, ${p.year}`;
  if (p.volume) s += `, ${p.volume}`;
  if (p.issue) s += `(${p.issue})`;
  if (p.pages) s += `: ${p.pages}`;
  return s;
}

/** GB/T 7714 风格（中文论文）或 APA 风格（英文论文）的引用 */
export function citation(p: Paper['data']) {
  const doi = p.doi ? ` DOI: ${p.doi}.` : '';
  if (p.lang === 'zh') {
    if (p.status === 'thesis') return `${p.authors.join(', ')}. ${p.title}[D]. ${p.publisher ?? p.venue}, ${p.year}.`;
    return `${p.authors.join(', ')}. ${p.title}[J]. ${venueLine(p)}.${doi}`;
  }
  const names = p.authors.map((a) => {
    const parts = a.split(' ');
    const last = parts.pop();
    return `${last}, ${parts.map((x) => x[0] + '.').join(' ')}`;
  });
  const authorStr = names.length > 1 ? names.slice(0, -1).join(', ') + ', & ' + names.at(-1) : names[0];
  let s = `${authorStr} (${p.year}). ${p.title}. ${p.venue}`;
  if (p.volume) s += `, ${p.volume}`;
  if (p.issue) s += `(${p.issue})`;
  if (p.pages) s += `, ${p.pages}`;
  return s + '.' + (p.doi ? ` https://doi.org/${p.doi}` : '');
}
