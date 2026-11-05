
import API from "./api";
import { useEffect } from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

// Public Website Pages
import Home from "./pages/Home";
import Blogs from "./pages/Blogs";
import BlogDetails from "./pages/BlogDetails";

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
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* All Published Blogs */}
                <Route
                    path="/blogs"
                    element={<Blogs />}
                />

                {/* Individual Blog Details */}
                <Route
                    path="/blogs/:id"
                    element={<BlogDetails />}
                />

                {/* Admin Dashboard */}
                <Route
                    path="/admin"
                    element={<Admin />}
                />

                {/* Separate Admin Blogs Management */}
                <Route
                    path="/admin/blogs"
                    element={<AdminBlogs />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
