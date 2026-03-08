import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { LIVROS_BIBLIA } from '../bibliaLivros'
import { fetchCapituloPT, parseReferencia } from '../bibliaApi'
import './BibliaNT.css'

const STORAGE_MARCADOS = 'biblia-marcados'
const STORAGE_ESTUDO = 'biblia-estudo'

function loadMarcados() {
  try {
    const raw = localStorage.getItem(STORAGE_MARCADOS)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? new Set(arr) : new Set()
  } catch {
    return new Set()
  }
}

function saveMarcados(set) {
  try {
    localStorage.setItem(STORAGE_MARCADOS, JSON.stringify([...set]))
  } catch (_) {}
}

function loadEstudo(bookIndex, chapter) {
  try {
    const raw = localStorage.getItem(`${STORAGE_ESTUDO}-${bookIndex}-${chapter}`)
    const data = raw ? JSON.parse(raw) : {}
    return {
      chapterNote: data.chapterNote ?? '',
      verses: typeof data.verses === 'object' ? data.verses : {},
    }
  } catch {
    return { chapterNote: '', verses: {} }
  }
}

function saveEstudo(bookIndex, chapter, data) {
  try {
    localStorage.setItem(`${STORAGE_ESTUDO}-${bookIndex}-${chapter}`, JSON.stringify(data))
  } catch (_) {}
}

export default function BibliaNT() {
  const [bookIndex, setBookIndex] = useState(39)
  const [capitulo, setCapitulo] = useState(1)
  const [versiculoAlvo, setVersiculoAlvo] = useState(null)
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)
  const [marcados, setMarcados] = useState(loadMarcados)
  const [consultaInput, setConsultaInput] = useState('')
  const [consultaErro, setConsultaErro] = useState(null)
  const [estudo, setEstudo] = useState(() => loadEstudo(39, 1))
  const [audioLendo, setAudioLendo] = useState(false)
  const [audioPausado, setAudioPausado] = useState(false)
  const versosRef = useRef(null)
  const utteranceRef = useRef(null)
  const synthRef = useRef(null)

  const livro = LIVROS_BIBLIA[bookIndex]
  const totalCapitulos = livro?.capitulos ?? 1

  const persistMarcados = useCallback((novoSet) => {
    setMarcados(novoSet)
    saveMarcados(novoSet)
  }, [])

  const toggleMarcado = useCallback(
    (verseNum) => {
      const key = `${bookIndex}-${capitulo}-${verseNum}`
      const next = new Set(marcados)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      persistMarcados(next)
    },
    [bookIndex, capitulo, marcados, persistMarcados]
  )

  const isMarcado = useCallback(
    (verseNum) => marcados.has(`${bookIndex}-${capitulo}-${verseNum}`),
    [bookIndex, capitulo, marcados]
  )

  useEffect(() => {
    setCarregando(true)
    setErro(null)
    setVersiculoAlvo(null)
    fetchCapituloPT(bookIndex, capitulo)
      .then((data) => {
        setDados(data)
        setCarregando(false)
      })
      .catch(() => {
        setErro('Não foi possível carregar o capítulo.')
        setCarregando(false)
      })
  }, [bookIndex, capitulo])

  useEffect(() => {
    setEstudo(loadEstudo(bookIndex, capitulo))
  }, [bookIndex, capitulo])

  const goPrevChapter = () => {
    if (capitulo > 1) {
      setCapitulo((c) => c - 1)
    } else if (bookIndex > 0) {
      setBookIndex((b) => b - 1)
      setCapitulo(LIVROS_BIBLIA[bookIndex - 1].capitulos)
    }
  }

  const goNextChapter = () => {
    if (capitulo < totalCapitulos) {
      setCapitulo((c) => c + 1)
    } else if (bookIndex < 65) {
      setBookIndex((b) => b + 1)
      setCapitulo(1)
    }
  }

  const podeAnterior = bookIndex > 0 || capitulo > 1
  const podeProximo = bookIndex < 65 || capitulo < totalCapitulos

  const irParaConsulta = () => {
    setConsultaErro(null)
    const parsed = parseReferencia(consultaInput.trim(), LIVROS_BIBLIA)
    if (!parsed) {
      setConsultaErro('Referência inválida. Ex.: João 3:16 ou 1 Coríntios 13:4')
      return
    }
    setBookIndex(parsed.bookIndex)
    setCapitulo(parsed.chapter)
    setVersiculoAlvo(parsed.verse)
    setConsultaInput('')
  }

  useEffect(() => {
    if (!versiculoAlvo || !dados?.verses?.length || !versosRef.current) return
    const el = document.getElementById(`biblia-v-${versiculoAlvo}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.classList.add('biblia-verso-destaco')
      const t = setTimeout(() => el.classList.remove('biblia-verso-destaco'), 2000)
      return () => clearTimeout(t)
    }
  }, [versiculoAlvo, dados])

  const handleChapterNoteChange = (value) => {
    const next = { ...estudo, chapterNote: value }
    setEstudo(next)
    saveEstudo(bookIndex, capitulo, next)
  }

  const handleVerseNoteChange = (verseNum, value) => {
    const next = {
      ...estudo,
      verses: { ...estudo.verses, [String(verseNum)]: value },
    }
    setEstudo(next)
    saveEstudo(bookIndex, capitulo, next)
  }

  const playAudio = () => {
    if (!dados?.verses?.length) return
    if (synthRef.current?.speaking && !audioPausado) {
      synthRef.current.cancel()
      setAudioLendo(false)
      return
    }
    const synth = window.speechSynthesis
    if (!synth) {
      setConsultaErro('Seu navegador não suporta leitura por áudio.')
      return
    }
    synth.cancel()
    const locale = 'pt-BR'
    const voices = synth.getVoices().filter((v) => v.lang.startsWith('pt'))
    const voice = voices[0] || synth.getVoices().find((v) => v.lang.startsWith('pt')) || null
    const texto = dados.verses.map((v) => `${v.verse}. ${v.text.trim()}`).join(' ')
    const u = new SpeechSynthesisUtterance(texto)
    u.lang = locale
    if (voice) u.voice = voice
    u.rate = 0.95
    u.onend = () => setAudioLendo(false)
    u.onerror = () => setAudioLendo(false)
    utteranceRef.current = u
    synthRef.current = synth
    synth.speak(u)
    setAudioLendo(true)
    setAudioPausado(false)
  }

  const stopAudio = () => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setAudioLendo(false)
      setAudioPausado(false)
    }
  }

  useEffect(() => {
    const synth = window.speechSynthesis
    if (synth?.getVoices().length === 0) {
      synth.addEventListener('voiceschanged', () => synth.getVoices())
    }
    return () => {
      stopAudio()
    }
  }, [])

  return (
    <>
      <div className="livro-header biblia-header">
        <Link to="/" className="voltar">← Voltar ao início</Link>
        <h1>Bíblia — Antigo e Novo Testamento</h1>
        <p className="page-subtitle">
          Leia por livro e capítulo em português. Marque versículos, consulte referências e use o painel de estudo. Tradução: NVI.
        </p>
      </div>

      <div className="biblia-layout">
        <aside className="biblia-nav">
          <label className="biblia-label">Livro</label>
          <select
            className="biblia-select"
            value={bookIndex}
            onChange={(e) => {
              setBookIndex(Number(e.target.value))
              setCapitulo(1)
            }}
          >
            <optgroup label="Antigo Testamento">
              {LIVROS_BIBLIA.slice(0, 39).map((l, i) => (
                <option key={i} value={i}>
                  {l.nome}
                </option>
              ))}
            </optgroup>
            <optgroup label="Novo Testamento">
              {LIVROS_BIBLIA.slice(39, 66).map((l, i) => (
                <option key={i} value={39 + i}>
                  {l.nome}
                </option>
              ))}
            </optgroup>
          </select>

          <label className="biblia-label">Capítulo</label>
          <select
            className="biblia-select"
            value={capitulo}
            onChange={(e) => setCapitulo(Number(e.target.value))}
          >
            {Array.from({ length: totalCapitulos }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <p className="biblia-ref">
            {livro?.nome} {capitulo}
          </p>

          <div className="biblia-consulta">
            <label className="biblia-label">Consultar versículo</label>
            <input
              type="text"
              className="biblia-input"
              placeholder="Ex.: João 3:16"
              value={consultaInput}
              onChange={(e) => {
                setConsultaInput(e.target.value)
                setConsultaErro(null)
              }}
              onKeyDown={(e) => e.key === 'Enter' && irParaConsulta()}
            />
            <button type="button" className="biblia-btn biblia-btn-consulta" onClick={irParaConsulta}>
              Ir
            </button>
            {consultaErro && <p className="biblia-consulta-erro">{consultaErro}</p>}
          </div>

          <div className="biblia-audio-wrap">
            <button
              type="button"
              className="biblia-btn biblia-btn-audio"
              onClick={audioLendo ? stopAudio : playAudio}
              disabled={carregando || !dados?.verses?.length}
              title="Ouvir este capítulo (síntese de voz)"
            >
              {audioLendo ? '⏹ Parar áudio' : '▶ Ouvir capítulo'}
            </button>
          </div>
        </aside>

        <article className="biblia-conteudo" ref={versosRef}>
          {carregando && <p className="biblia-msg">Carregando…</p>}
          {erro && <p className="biblia-erro">{erro}</p>}
          {!carregando && !erro && dados?.verses?.length > 0 && (
            <div className="biblia-conteudo-inner">
              <div className="biblia-cabecalho">
                <h2 className="biblia-titulo">
                  {dados.bookName} {dados.chapter}
                  {dados.translation_name && (
                    <span className="biblia-traducao"> — {dados.translation_name}</span>
                  )}
                </h2>
                <nav className="biblia-nav-capitulos" aria-label="Capítulo anterior e próximo">
                  <button
                    type="button"
                    className="biblia-arrow"
                    onClick={goPrevChapter}
                    disabled={!podeAnterior}
                    title="Capítulo anterior"
                    aria-label="Capítulo anterior"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    className="biblia-arrow"
                    onClick={goNextChapter}
                    disabled={!podeProximo}
                    title="Próximo capítulo"
                    aria-label="Próximo capítulo"
                  >
                    Próximo →
                  </button>
                </nav>
              </div>
              <p className="biblia-dica">Clique no número do versículo para marcar ou desmarcar.</p>
              <div className="biblia-versos">
                {dados.verses.map((v) => (
                  <p
                    key={v.verse}
                    id={versiculoAlvo === v.verse ? `biblia-v-${v.verse}` : undefined}
                    className={`biblia-verso ${isMarcado(v.verse) ? 'biblia-verso-marcado' : ''}`}
                  >
                    <button
                      type="button"
                      className="biblia-num"
                      onClick={() => toggleMarcado(v.verse)}
                      title={isMarcado(v.verse) ? 'Desmarcar versículo' : 'Marcar versículo'}
                      aria-pressed={isMarcado(v.verse)}
                    >
                      {v.verse}
                    </button>
                    <span className="biblia-texto">{v.text.trim()}</span>
                  </p>
                ))}
              </div>
              <nav className="biblia-nav-capitulos biblia-nav-capitulos-bottom" aria-label="Capítulo anterior e próximo">
                <button
                  type="button"
                  className="biblia-arrow"
                  onClick={goPrevChapter}
                  disabled={!podeAnterior}
                  aria-label="Capítulo anterior"
                >
                  ← Anterior
                </button>
                <button
                  type="button"
                  className="biblia-arrow"
                  onClick={goNextChapter}
                  disabled={!podeProximo}
                  aria-label="Próximo capítulo"
                >
                  Próximo →
                </button>
              </nav>
            </div>
          )}
        </article>

        <aside className="biblia-estudo">
          <h3 className="biblia-estudo-titulo">Estudo e observação</h3>
          <label className="biblia-label">Notas deste capítulo</label>
          <textarea
            className="biblia-estudo-textarea"
            placeholder="Anote observações sobre este capítulo…"
            value={estudo.chapterNote}
            onChange={(e) => handleChapterNoteChange(e.target.value)}
            rows={4}
          />
          <label className="biblia-label">Versículos marcados — notas</label>
          <div className="biblia-estudo-versos">
            {dados?.verses
              ?.filter((v) => isMarcado(v.verse))
              .map((v) => (
                <div key={v.verse} className="biblia-estudo-verso-item">
                  <span className="biblia-estudo-verso-ref">
                    {livro?.nome} {capitulo}:{v.verse}
                  </span>
                  <textarea
                    className="biblia-estudo-textarea biblia-estudo-textarea-verso"
                    placeholder="Nota para este versículo…"
                    value={estudo.verses[String(v.verse)] ?? ''}
                    onChange={(e) => handleVerseNoteChange(v.verse, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            {(!dados?.verses?.length || dados.verses.filter((v) => isMarcado(v.verse)).length === 0) && (
              <p className="biblia-estudo-vazio">Marque versículos no texto para adicionar notas aqui.</p>
            )}
          </div>
        </aside>
      </div>
    </>
  )
}
