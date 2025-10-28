import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home/Home'
import Cursos from './pages/Cursos/Cursos'
import CursoDetalhes from './pages/CursoDetalhes/CursoDetalhes'
import Jornada from './pages/Jornada/Jornada'
import Usuario from './pages/Usuario/Usuario'
import Admin from './pages/Admin/Admin'
import Cadastro from './pages/Cadastro/Cadastro'
import Configuracoes from './pages/Configuracoes/Configuracoes'
import Registro from './pages/Registro/Registro'
import Login from './pages/Login/Login'

const Rotas = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/curso/:id" element={<CursoDetalhes />} />
      <Route path="/jornada/:slug" element={<Jornada />} />
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin={true}>
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="/cadastro" element={
        <ProtectedRoute requireAdmin={true}>
          <Cadastro />
        </ProtectedRoute>
      } />
      <Route path="/configuracoes" element={
        <ProtectedRoute>
          <Configuracoes />
        </ProtectedRoute>
      } />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default Rotas