
import API from "./api";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Website Pages
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";
import News from "./pages/News";
import About from "./pages/About";
import Contact from "./pages/Contact";

// Admin Pages
import Admin from "./pages/Admin";
import AdminBlogs from "./pages/AdminBlogs";

function App() {
  // Backend database connection test
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
        {/* Public Website */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Blog Pages */}
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />

        {/* News Page */}
        <Route path="/news" element={<News />} />

        {/* Admin Pages */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/blogs" element={<AdminBlogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
