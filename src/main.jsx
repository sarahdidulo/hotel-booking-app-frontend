import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BannerProvider } from './components/Banner/BannerContext.jsx';
import { CurrentUserProvider } from "./components/CurrentUserContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrentUserProvider>
      <BannerProvider>
        <App />
      </BannerProvider>  
    </CurrentUserProvider>
  </StrictMode>,
)
