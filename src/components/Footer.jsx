import { Link } from 'react-router-dom'

export default function Footer() {
  const ano = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <nav className="footer-nav" aria-label="Rodapé">
          <Link to="/">Início</Link>
          <Link to="/biblia">Bíblia</Link>
          <Link to="/perguntas-novo-nascimento">Perguntas — Novo Nascimento</Link>
          <Link to="/dizimo">Dízimo</Link>
          <Link to="/espirito-santo">Espírito Santo</Link>
          <Link to="/jesus-cumpriu">Jesus cumpriu</Link>
          <Link to="/igreja">Igreja no NT</Link>
        </nav>
        <p className="footer-copy">
          Estudo do Novo Testamento — texto, contexto e prática. © {ano}
        </p>
      </div>
    </footer>
  )
}
