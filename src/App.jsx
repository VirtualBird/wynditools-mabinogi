import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import Wine_Making from '../pages/WineMaking/Wine_Making'
import AlbanKnights from '../pages/AlbanKnights/AlbanKnights'
import Enchant from '../pages/Enchant/Enchant'
import Cooking from '../pages/Cooking/Cooking'

import NotFound from '../pages/NotFound'

import MainLayout from "../components/MainLayout"


import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout/>}>
          
          <Route index element={<Home/>}/>
          <Route path="wine-making" element={<Wine_Making/>}/>
          <Route path="alban-knights-training-stones" element={<AlbanKnights/>}/>
          <Route path="enchant" element={<Enchant/>}/>
          <Route path="cooking" element={<Cooking/>}/>

          <Route path="*" element={<NotFound/>}/>
        
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
