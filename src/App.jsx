// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import MyProjects from "./pages/MyProjects";   // ✅ updated import
import MyProfile from "./pages/MyProfile";
import VerifyPayment from "./pages/VerifyPayment";
import Services from "./pages/Services";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen animate-fadeIn">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/my-projects" element={<MyProjects />} />   {/* ✅ updated route */}
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/verify" element={<VerifyPayment />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}