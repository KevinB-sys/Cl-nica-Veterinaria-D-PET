import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ScrollToTopButton from '../components/Scroll'
import { Outlet } from 'react-router'
import '../estilos css/App.css'

export default function Layout() {
  return (
   <div className="app-container">
    <Navbar />
    <Outlet/>
    <ScrollToTopButton /> {/* Botón de scroll */}
    <Footer />

   </div>
  )
}
