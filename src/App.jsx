import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Inicio from './pages/Inicio'
import Livro from './pages/Livro'
import Dizimo from './pages/Dizimo'
import EspiritoSanto from './pages/EspiritoSanto'
import JesusCumpriu from './pages/JesusCumpriu'
import IgrejaNT from './pages/IgrejaNT'
import BibliaNT from './pages/BibliaNT'
import PerguntasNovoNascimento from './pages/PerguntasNovoNascimento'
import Atos217 from './pages/Atos217'
import './App.css'

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="livro/:livroId" element={<Livro />} />
          <Route path="dizimo" element={<Dizimo />} />
          <Route path="espirito-santo" element={<EspiritoSanto />} />
          <Route path="jesus-cumpriu" element={<JesusCumpriu />} />
          <Route path="igreja" element={<IgrejaNT />} />
          <Route path="biblia" element={<BibliaNT />} />
          <Route path="perguntas-novo-nascimento" element={<PerguntasNovoNascimento />} />
          <Route path="atos-2-17" element={<Atos217 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
