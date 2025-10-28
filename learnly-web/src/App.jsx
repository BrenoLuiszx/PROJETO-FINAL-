import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Rotas from './rotas'
import './App.css'
import './styles/global.css'
import './styles/theme.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Rotas />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
