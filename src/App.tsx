import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { initializeDatabase } from './services/database'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import Finance from './pages/Finance'
import Goals from './pages/Goals'
import Habits from './pages/Habits'
import AIAssistant from './pages/AIAssistant'
import Settings from './pages/Settings'
import Loading from './components/Loading'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeDatabase()
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to initialize app:', error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/ai" element={<AIAssistant />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
