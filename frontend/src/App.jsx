import API from "./api";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

function App() {
  useEffect(() => {
    API.get("/api/db-test")
        .then((response) => {
            console.log("Backend response:", response.data);
        })
        .catch((error) => {
            console.error("Backend connection error:", error);
        });
}, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App