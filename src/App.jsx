import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScreenSetup from './Pages/ScreenSetUp'
import ScreenBuilder from './Pages/ScreenBuilder'
import GenerateScreen from './Pages/GenerateScreen';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ScreenSetup />} />
        <Route path="/screenbuilder" element={<ScreenBuilder />} />
        <Route path="/screengenerate" element={<GenerateScreen />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
