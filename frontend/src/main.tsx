import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ListCars from './pages/ListCars'
import CarForm from './pages/CarForm'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListCars/>} />
        <Route path="/cars/new" element={<CarForm onClose={function (): void {
                    throw new Error('Function not implemented.')
                } } onSaved={function (): void {
                    throw new Error('Function not implemented.')
                } }/>} />
        <Route path="/cars/:id/edit" element={<CarForm onClose={function (): void {
                    throw new Error('Function not implemented.')
                } } onSaved={function (): void {
                    throw new Error('Function not implemented.')
                } }/>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
