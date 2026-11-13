import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import rootReducer from './reducer/index.jsx'
import { configureStore } from '@reduxjs/toolkit'
import {Toaster} from 'react-hot-toast'


const store = configureStore({
  reducer:rootReducer
})

// Prevent pinch-to-zoom and multi-touch zoom gestures in mobile view
if (typeof window !== 'undefined') {
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());
  document.addEventListener('gestureend', (e) => e.preventDefault());

  document.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false }
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
     <Provider store={store} >
       <App />
       <Toaster/>
    </Provider>
    </BrowserRouter>
   
   
  </StrictMode>,
)
