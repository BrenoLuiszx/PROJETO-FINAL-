import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Rotas from './rotas'
import './App.css'
import './styles/global.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Rotas />
      </Router>
    </AuthProvider>
  )
}

export default App
