import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home/Home'
import Cursos from './pages/Cursos/Cursos'
import CursoDetalhes from './pages/CursoDetalhes/CursoDetalhes'
import AulaPlayer from './pages/AulaPlayer/AulaPlayer'
import Jornada from './pages/Jornada/Jornada'
import Usuario from './pages/Usuario/Usuario'
import Admin from './pages/Admin/Admin'
import Colaborador from './pages/Colaborador/Colaborador'
import Cadastro from './pages/Cadastro/Cadastro'
import Configuracoes from './pages/Configuracoes/Configuracoes'
import Registro from './pages/Registro/Registro'
import Login from './pages/Login/Login'
import Perfil from './pages/Perfil/Perfil'

const Rotas = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/cursos" element={<Cursos />} />
      <Route path="/curso/:id" element={<CursoDetalhes />} />
      <Route path="/curso/:cursoId/aula/:aulaId" element={
        <ProtectedRoute>
          <AulaPlayer />
        </ProtectedRoute>
      } />
      <Route path="/jornada/:slug" element={<Jornada />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas autenticadas */}
      <Route path="/usuario" element={<Usuario />} />
      <Route path="/perfil" element={
        <ProtectedRoute>
          <Perfil />
        </ProtectedRoute>
      } />
      <Route path="/configuracoes" element={
        <ProtectedRoute>
          <Configuracoes />
        </ProtectedRoute>
      } />

      {/* Rota colaborador */}
      <Route path="/colaborador" element={
        <ProtectedRoute requireColaborador={true}>
          <Colaborador />
        </ProtectedRoute>
      } />

      {/* Rotas admin */}
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
    </Routes>
  )
}

export default Rotas
