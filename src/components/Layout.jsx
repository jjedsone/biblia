import { Link, Outlet, useParams, useLocation } from 'react-router-dom'
import { LIVROS } from '../livros'
import ThemeSelector from './ThemeSelector'
import Footer from './Footer'

export default function Layout() {
  const { livroId } = useParams()
  const location = useLocation()
  const path = location.pathname
  const isDizimo = path === '/dizimo'
  const isEspiritoSanto = path === '/espirito-santo'
  const isJesusCumpriu = path === '/jesus-cumpriu'
  const isIgreja = path === '/igreja'
  const isBiblia = path === '/biblia'
  const isPerguntas = path === '/perguntas-novo-nascimento'

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="header-home">Estudo do Novo Testamento</Link>
        <nav className="header-nav" aria-label="Temas">
          <Link to="/biblia" className={isBiblia ? 'header-link ativo' : 'header-link'}>Bíblia</Link>
          <Link to="/perguntas-novo-nascimento" className={isPerguntas ? 'header-link ativo' : 'header-link'}>Perguntas</Link>
          <Link to="/dizimo" className={isDizimo ? 'header-link ativo' : 'header-link'}>Dízimo</Link>
          <Link to="/espirito-santo" className={isEspiritoSanto ? 'header-link ativo' : 'header-link'}>Espírito Santo</Link>
          <Link to="/jesus-cumpriu" className={isJesusCumpriu ? 'header-link ativo' : 'header-link'}>Jesus cumpriu</Link>
          <Link to="/igreja" className={isIgreja ? 'header-link ativo' : 'header-link'}>Igreja no NT</Link>
        </nav>
        <ThemeSelector />
      </header>
      <div className="app-body">
        <aside className="sidebar">
          <p className="sidebar-title">Livros</p>
          <nav>
            <ul className="sidebar-nav">
              {LIVROS.map((livro, i) => (
                <li key={livro.id}>
                  <Link
                    to={`/livro/${livro.id}`}
                    className={livroId === livro.id && !isDizimo && !isEspiritoSanto && !isJesusCumpriu && !isIgreja && !isBiblia && !isPerguntas ? 'ativo' : ''}
                  >
                    {i + 1}. {livro.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
