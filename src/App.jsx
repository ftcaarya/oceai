import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import ChatBot from './pages/ChatBot'
import FishPredictor from './pages/FishPredictor'

function App() {
  return (
    <div className="min-h-screen bg-base-950 relative">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat" element={<ChatBot />} />
          <Route path="/fish" element={<FishPredictor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
