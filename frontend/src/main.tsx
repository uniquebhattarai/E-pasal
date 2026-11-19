import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'

// Prevent pinch-to-zoom and multi-touch zoom gestures in mobile view
if (typeof window !== 'undefined') {
  document.addEventListener('gesturestart', (e: Event) => e.preventDefault());
  document.addEventListener('gesturechange', (e: Event) => e.preventDefault());
  document.addEventListener('gestureend', (e: Event) => e.preventDefault());

  document.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <ThemeProvider>
            <App />
            <Toaster />
          </ThemeProvider>
        </Provider>
      </BrowserRouter>
    </StrictMode>,
  );
}
