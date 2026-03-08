import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { LIVROS } from '../livros'

export default function Livro() {
  const { livroId } = useParams()
  const [conteudo, setConteudo] = useState('')
  const [status, setStatus] = useState('carregando')

  const livro = LIVROS.find((l) => l.id === livroId)

  useEffect(() => {
    if (!livroId) return
    setStatus('carregando')
    fetch(`/estudo/${livroId}.md`)
      .then((r) => {
        if (!r.ok) throw new Error('Arquivo não encontrado')
        return r.text()
      })
      .then((md) => {
        setConteudo(md)
        setStatus('ok')
      })
      .catch(() => setStatus('erro'))
  }, [livroId])

  if (!livro) {
    return (
      <>
        <p className="erro">Livro não encontrado.</p>
        <Link to="/" className="voltar">← Voltar ao índice</Link>
      </>
    )
  }

  return (
    <>
      <div className="livro-header">
        <Link to="/" className="voltar">← Voltar ao índice</Link>
        <h1>{livro.nome}</h1>
      </div>
      {status === 'carregando' && <p className="carregando">Carregando…</p>}
      {status === 'erro' && (
        <p className="erro">
          Não foi possível carregar o estudo. Verifique se o arquivo existe em public/estudo.
        </p>
      )}
      {status === 'ok' && (
        <article className="conteudo-livro">
          <ReactMarkdown>{conteudo}</ReactMarkdown>
        </article>
      )}
    </>
  )
}
