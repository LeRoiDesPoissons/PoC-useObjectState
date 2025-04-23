import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { DataLoader, PersonForm } from './components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/person-form' index element={<PersonForm />} />
          <Route path='/data-loader' index element={<DataLoader />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
