import { useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { FooterHud } from './components/layout/FooterHud'
import { NotificationProvider } from './contexts/NotificationContext'
import { NotificationPanel } from './components/notifications/NotificationPanel'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <NotificationProvider>
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
          <main className="app-main">
            <Outlet />
          </main>
        </div>
        <FooterHud />
        <NotificationPanel />
      </div>
    </NotificationProvider>
  )
}

export default App
