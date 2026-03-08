import { useState, useEffect } from 'react'
import { Link, Outlet, useParams, useLocation } from 'react-router-dom'
import { LIVROS } from '../livros'
import ThemeSelector from './ThemeSelector'
import Footer from './Footer'

const isPaginaTema = (path) => {
  const temas = ['/dizimo', '/espirito-santo', '/jesus-cumpriu', '/igreja', '/biblia', '/perguntas-novo-nascimento', '/atos-2-17']
  return temas.some((t) => path === t || path.startsWith(t + '/'))
}

export default function Layout() {
  const { livroId } = useParams()
  const location = useLocation()
  const path = location.pathname
  const [sidebarAberto, setSidebarAberto] = useState(false)
  const [menuAberto, setMenuAberto] = useState(false)

  const isLivroAtivo = livroId && !isPaginaTema(path)
  const ativo = (p) => path === p || path.startsWith(p + '/')

  useEffect(() => {
    setSidebarAberto(false)
    setMenuAberto(false)
  }, [path])

  useEffect(() => {
    if (menuAberto || sidebarAberto) document.body.classList.add('overflow-hidden')
    else document.body.classList.remove('overflow-hidden')
    return () => document.body.classList.remove('overflow-hidden')
  }, [menuAberto, sidebarAberto])

  return (
    <div className="app">
      <header className="header">
        <button
          type="button"
          className="header-menu-btn"
          onClick={() => setSidebarAberto((v) => !v)}
          aria-label="Abrir menu de livros"
          aria-expanded={sidebarAberto}
        >
          <span className="header-menu-icon" />
        </button>
        <Link to="/" className="header-home">Estudo do Novo Testamento</Link>
        <nav className="header-nav" aria-label="Navegação principal">
          <Link to="/biblia" className={ativo('/biblia') ? 'header-link ativo' : 'header-link'}>Bíblia</Link>
          <Link to="/perguntas-novo-nascimento" className={ativo('/perguntas-novo-nascimento') ? 'header-link ativo' : 'header-link'}>Perguntas</Link>
          <Link to="/dizimo" className={ativo('/dizimo') ? 'header-link ativo' : 'header-link'}>Dízimo</Link>
          <Link to="/espirito-santo" className={ativo('/espirito-santo') ? 'header-link ativo' : 'header-link'}>Espírito Santo</Link>
          <Link to="/jesus-cumpriu" className={ativo('/jesus-cumpriu') ? 'header-link ativo' : 'header-link'}>Jesus cumpriu</Link>
          <Link to="/igreja" className={ativo('/igreja') ? 'header-link ativo' : 'header-link'}>Igreja no NT</Link>
          <Link to="/atos-2-17" className={ativo('/atos-2-17') ? 'header-link ativo' : 'header-link'}>Atos 2:17</Link>
        </nav>
        <button
          type="button"
          className="header-nav-toggle"
          onClick={() => setMenuAberto((v) => !v)}
          aria-label="Abrir menu"
          aria-expanded={menuAberto}
        >
          <span className="header-nav-toggle-bar" />
          <span className="header-nav-toggle-bar" />
          <span className="header-nav-toggle-bar" />
        </button>
        <div className="header-actions">
          <ThemeSelector />
        </div>
      </header>

      <div className={`header-dropdown ${menuAberto ? 'aberto' : ''}`} aria-hidden={!menuAberto}>
        <nav className="header-dropdown-nav">
          <Link to="/biblia" className={ativo('/biblia') ? 'ativo' : ''}>Bíblia</Link>
          <Link to="/perguntas-novo-nascimento" className={ativo('/perguntas-novo-nascimento') ? 'ativo' : ''}>Perguntas</Link>
          <Link to="/dizimo" className={ativo('/dizimo') ? 'ativo' : ''}>Dízimo</Link>
          <Link to="/espirito-santo" className={ativo('/espirito-santo') ? 'ativo' : ''}>Espírito Santo</Link>
          <Link to="/jesus-cumpriu" className={ativo('/jesus-cumpriu') ? 'ativo' : ''}>Jesus cumpriu</Link>
          <Link to="/igreja" className={ativo('/igreja') ? 'ativo' : ''}>Igreja no NT</Link>
          <Link to="/atos-2-17" className={ativo('/atos-2-17') ? 'ativo' : ''}>Atos 2:17</Link>
        </nav>
      </div>

      <div className="sidebar-overlay" aria-hidden={!sidebarAberto} onClick={() => setSidebarAberto(false)} />

      <div className="app-body">
        <aside className={`sidebar ${sidebarAberto ? 'aberto' : ''}`}>
          <div className="sidebar-header">
            <p className="sidebar-title">Livros</p>
            <button type="button" className="sidebar-close" onClick={() => setSidebarAberto(false)} aria-label="Fechar">×</button>
          </div>
          <p className="sidebar-title sidebar-title-desktop">Livros</p>
          <nav>
            <ul className="sidebar-nav">
              {LIVROS.map((livro, i) => (
                <li key={livro.id}>
                  <Link
                    to={`/livro/${livro.id}`}
                    className={isLivroAtivo && livroId === livro.id ? 'ativo' : ''}
                  >
                    <span className="sidebar-num">{i + 1}</span>
                    {livro.nome}
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
