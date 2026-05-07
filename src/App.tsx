import { useState } from 'react'
import { Header } from './components/layout/Header'
import { Sidebar, type Page } from './components/layout/Sidebar'
import { FooterHud } from './components/layout/FooterHud'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activePage, setActivePage] = useState<Page>('map')

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
          activePage={activePage}
          onNavigate={setActivePage}
        />
        <main className="app-main">{/* Page content — rendered by later phases */}</main>
      </div>
      <FooterHud />
    </div>
  )
}

export default App
