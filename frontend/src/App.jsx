import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import API from "./api";
import NewsletterPreview from "./pages/NewsletterPreview";
import AddSubscriber from "./pages/AddSubscriber";
import EditSubscriber from "./pages/EditSubscriber";
import Subscriber from "./pages/Subscriber";
import EditNewsletter from "./pages/EditNewsletter";
import CreateNewsletter from "./pages/CreateNewsletter";
import Newsletters from "./pages/newsletters";
import Dashboard from "./pages/Dashboard";

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

        <Route path="/" element={<Navigate to="/admin" replace />} />
                <Route path="/admin/newsletters" element={<Newsletters />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route
  path="/admin/newsletters/edit/:id"
  element={<EditNewsletter />}
/>
<Route
  path="/admin/subscribers"
  element={<Subscriber />}
/>
<Route
    path="/admin/newsletters/preview/:id"
    element={<NewsletterPreview />}
/>
<Route
  path="/admin/subscribers/add"
  element={<AddSubscriber />}
/>

<Route
  path="/admin/subscribers/edit/:id"
  element={<EditSubscriber />}
/>
        <Route
  path="/admin/newsletters/create"
  element={<CreateNewsletter />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;