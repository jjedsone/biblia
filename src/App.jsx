import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import './App.css'

const Inicio = lazy(() => import('./pages/Inicio'))
const Livro = lazy(() => import('./pages/Livro'))
const Dizimo = lazy(() => import('./pages/Dizimo'))
const EspiritoSanto = lazy(() => import('./pages/EspiritoSanto'))
const JesusCumpriu = lazy(() => import('./pages/JesusCumpriu'))
const IgrejaNT = lazy(() => import('./pages/IgrejaNT'))
const BibliaNT = lazy(() => import('./pages/BibliaNT'))
const PerguntasNovoNascimento = lazy(() => import('./pages/PerguntasNovoNascimento'))
const Atos217 = lazy(() => import('./pages/Atos217'))

function PageFallback() {
  return (
    <div className="page-loading" aria-hidden="true">
      <span className="page-loading-spinner" />
      <span className="page-loading-text">Carregando…</span>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Suspense fallback={<PageFallback />}><Inicio /></Suspense>} />
          <Route path="livro/:livroId" element={<Suspense fallback={<PageFallback />}><Livro /></Suspense>} />
          <Route path="dizimo" element={<Suspense fallback={<PageFallback />}><Dizimo /></Suspense>} />
          <Route path="espirito-santo" element={<Suspense fallback={<PageFallback />}><EspiritoSanto /></Suspense>} />
          <Route path="jesus-cumpriu" element={<Suspense fallback={<PageFallback />}><JesusCumpriu /></Suspense>} />
          <Route path="igreja" element={<Suspense fallback={<PageFallback />}><IgrejaNT /></Suspense>} />
          <Route path="biblia" element={<Suspense fallback={<PageFallback />}><BibliaNT /></Suspense>} />
          <Route path="perguntas-novo-nascimento" element={<Suspense fallback={<PageFallback />}><PerguntasNovoNascimento /></Suspense>} />
          <Route path="atos-2-17" element={<Suspense fallback={<PageFallback />}><Atos217 /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
