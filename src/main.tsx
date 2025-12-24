import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from "react-router";
import Chat from './pages/Chat.tsx';
import TorrentProvider from './provider/TorrentProvider.tsx';

navigator.serviceWorker.register('/sw.min.js')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TorrentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/chat/:channel" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </TorrentProvider>
  </StrictMode>,
)
