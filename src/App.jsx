import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ChestClassify from "./pages/ChestClassify";
import BrainClassify from "./pages/BrainClassify";
import './App.css'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chest-classify" element={<ChestClassify />} />
        <Route path="/brain-classify" element={<BrainClassify />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App