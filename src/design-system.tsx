import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastProvider } from './components/ui/Toast'
import { DesignSystemDemo } from './pages/DesignSystemDemo'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <DesignSystemDemo />
    </ToastProvider>
  </StrictMode>,
)
