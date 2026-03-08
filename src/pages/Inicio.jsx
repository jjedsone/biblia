import { Link } from 'react-router-dom'
import { LIVROS } from '../livros'

export default function Inicio() {
  return (
    <>
      <section className="hero">
        <span className="pill">Texto · Contexto · Prática</span>
        <h1>Estudo do Novo Testamento</h1>
        <p>
          Estudo por livro, capítulo e versículo — como seguir os ensinamentos de Jesus,
          viver na igreja e adorar a Deus. Sem viés denominacional; baseado na Palavra.
        </p>
        <p className="hero-extra">
          <Link to="/dizimo" className="link-destaque">Dízimo na Bíblia</Link> — o que é, versículos, Antigo e Novo Testamento.
          {' '}
          <Link to="/espirito-santo" className="link-destaque">Espírito Santo na Nova Aliança</Link> — como nos portar e o que Paulo ensina.
          {' '}
          <Link to="/jesus-cumpriu" className="link-destaque">O que Jesus cumpriu e a transfiguração</Link> — o que não precisamos mais seguir; Moisés e Elias no monte.
          {' '}
          <Link to="/igreja" className="link-destaque">Como a igreja no NT deve se portar</Link> — extraído do Novo Testamento.
          {' '}
          <Link to="/biblia" className="link-destaque">Bíblia completa (AT + NT)</Link> — leia por livro e capítulo em português.
          {' '}
          <Link to="/perguntas-novo-nascimento" className="link-destaque">Perguntas — Novo Nascimento</Link> — mais de 150 perguntas para reflexão.
          {' '}
          <Link to="/atos-2-17" className="link-destaque">Atos 2:17 — Derramarei do meu Espírito</Link> — estudo do texto de Pedro no Pentecostes.
        </p>
      </section>
      <section className="livros-section">
        <h2>Índice dos livros</h2>
        <div className="livros-grid">
          {LIVROS.map((livro, i) => (
            <Link key={livro.id} to={`/livro/${livro.id}`}>
              <span className="num">{i + 1}</span>
              {livro.nome}
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
