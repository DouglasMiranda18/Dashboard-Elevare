import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import SocialMediaPlanning from './pages/SocialMediaPlanning'
import Messages from './pages/Messages'
import Packages from './pages/Packages'
import ContentIdeas from './pages/ContentIdeas'
import Clients from './pages/Clients'
import Checklists from './pages/Checklists'
import Documents from './pages/Documents'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/social-media" element={<SocialMediaPlanning />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/content-ideas" element={<ContentIdeas />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/checklists" element={<Checklists />} />
            <Route path="/documents" element={<Documents />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
