// JSON da NVI (thiagobodruk/biblia): 66 livros, ordem padrão (Gênesis–Apocalipse) = índices 0–65
const NUM_LIVROS = 66

let cacheNVI = null

const URL_BIBLIA_PT = import.meta.env.DEV
  ? '/biblia-pt.json'
  : 'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/nvi.json'

/**
 * Carrega o JSON da Bíblia NVI (português) uma vez e guarda em cache.
 */
export async function carregarBibliaPT() {
  if (cacheNVI) return cacheNVI
  const res = await fetch(URL_BIBLIA_PT)
  if (!res.ok) throw new Error('Não foi possível carregar a Bíblia.')
  const data = await res.json()
  if (!Array.isArray(data)) throw new Error('Formato inválido.')
  cacheNVI = data
  return cacheNVI
}

/**
 * Retorna os versículos de um capítulo (AT ou NT) em português (NVI).
 * @param {number} bookIndex 0–65 (0=Gênesis, 39=Mateus, 65=Apocalipse)
 * @param {number} capitulo Número do capítulo (1-based)
 */
export async function fetchCapituloPT(bookIndex, capitulo) {
  if (bookIndex < 0 || bookIndex >= NUM_LIVROS || capitulo < 1) return null
  const biblia = await carregarBibliaPT()
  const livro = biblia[bookIndex]
  if (!livro || !livro.chapters) return null
  const capituloIndex = capitulo - 1
  if (capituloIndex >= livro.chapters.length) return null
  const versos = livro.chapters[capituloIndex]
  if (!Array.isArray(versos)) return null
  const verses = versos.map((text, i) => ({ verse: i + 1, text: text || '' }))
  return {
    bookName: livro.book || '',
    chapter: capitulo,
    verses,
    translation_name: 'NVI (Nova Versão Internacional)',
  }
}

/**
 * Normaliza string para comparação (minúscula, sem acentos).
 */
function normalizar(s) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .trim()
}

/**
 * Parse de referência tipo "João 3:16" ou "1 Coríntios 13:4".
 * Retorna { bookIndex, chapter, verse } ou null.
 */
export function parseReferencia(ref, livros) {
  if (!ref || typeof ref !== 'string' || !livros?.length) return null
  const parts = ref
    .replace(/[,;:]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length < 2) return null
  for (let n = Math.min(3, parts.length); n >= 1; n--) {
    const nomeLivro = parts.slice(0, n).join(' ')
    const idx = livros.findIndex((l) => normalizar(l.nome) === normalizar(nomeLivro))
    if (idx !== -1) {
      const rest = parts.slice(n).map((p) => parseInt(p, 10)).filter((x) => !Number.isNaN(x))
      const chapter = rest[0] ?? 1
      const verse = rest[1] ?? null
      if (chapter >= 1 && chapter <= (livros[idx].capitulos ?? 1)) {
        return { bookIndex: idx, chapter, verse }
      }
      return null
    }
  }
  return null
}
