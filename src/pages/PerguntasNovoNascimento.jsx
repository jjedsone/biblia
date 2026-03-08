import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PERGUNTAS_NOVO_NASCIMENTO } from '../data/perguntasNovoNascimento'

export default function PerguntasNovoNascimento() {
  const [index, setIndex] = useState(0)
  const [mostrarResposta, setMostrarResposta] = useState(false)
  const [modoLista, setModoLista] = useState(false)

  const total = PERGUNTAS_NOVO_NASCIMENTO.length
  const item = PERGUNTAS_NOVO_NASCIMENTO[index]
  const numero = index + 1

  const anterior = () => {
    setIndex((i) => (i <= 0 ? total - 1 : i - 1))
    setMostrarResposta(false)
  }
  const proxima = () => {
    setIndex((i) => (i >= total - 1 ? 0 : i + 1))
    setMostrarResposta(false)
  }

  return (
    <>
      <div className="livro-header">
        <Link to="/" className="voltar">← Voltar ao início</Link>
        <h1>Perguntas — Novo Nascimento</h1>
        <p className="page-subtitle">
          Quiz com perguntas e respostas sobre o novo nascimento (João 3 e temas relacionados). Use para estudo e reflexão.
        </p>
      </div>

      <article className="conteudo-livro pagina-perguntas">
        <p className="perguntas-intro">
          Cada pergunta tem uma resposta breve com base na Palavra (João 3, 1 Pedro 1, Tito 3, Efésios 2, Romanos 6–8, entre outros). Leia a pergunta, reflita e depois confira a resposta.
        </p>

        {!modoLista ? (
          <>
            <div className="quiz-progress" role="status" aria-label={`Pergunta ${numero} de ${total}`}>
              <span className="quiz-progress-num">{numero}</span>
              <span className="quiz-progress-sep">/</span>
              <span className="quiz-progress-total">{total}</span>
            </div>

            <div className="quiz-card">
              <p className="quiz-pergunta">{item.pergunta}</p>
              {mostrarResposta && (
                <div className="quiz-resposta">
                  <span className="quiz-resposta-label">Resposta:</span>
                  <p>{item.resposta}</p>
                </div>
              )}
              <div className="quiz-actions">
                <button
                  type="button"
                  className="quiz-btn quiz-btn-ver"
                  onClick={() => setMostrarResposta((v) => !v)}
                  aria-expanded={mostrarResposta}
                >
                  {mostrarResposta ? 'Ocultar resposta' : 'Ver resposta'}
                </button>
              </div>
            </div>

            <nav className="quiz-nav" aria-label="Navegação do quiz">
              <button type="button" className="quiz-btn quiz-btn-nav" onClick={anterior} aria-label="Pergunta anterior">
                ← Anterior
              </button>
              <button type="button" className="quiz-btn quiz-btn-nav" onClick={proxima} aria-label="Próxima pergunta">
                Próxima →
              </button>
            </nav>

            <p className="quiz-toggle-wrap">
              <button
                type="button"
                className="quiz-toggle-list"
                onClick={() => setModoLista(true)}
              >
                Ver todas as perguntas em lista
              </button>
            </p>
          </>
        ) : (
          <>
            <p className="quiz-toggle-wrap">
              <button
                type="button"
                className="quiz-toggle-list"
                onClick={() => setModoLista(false)}
              >
                ← Voltar ao modo quiz
              </button>
            </p>
            <ol className="perguntas-lista perguntas-lista-completa">
              {PERGUNTAS_NOVO_NASCIMENTO.map((q, i) => (
                <li key={i} className="pergunta-item">
                  <strong>{q.pergunta}</strong>
                  <span className="pergunta-resposta-list">{q.resposta}</span>
                </li>
              ))}
            </ol>
            <p className="perguntas-total">
              Total: {total} perguntas.
            </p>
          </>
        )}
      </article>
    </>
  )
}
