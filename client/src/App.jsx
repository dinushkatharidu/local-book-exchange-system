import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import BookForm from "./pages/BookForm";
import { useAuth } from "./store/useAuth";
import { pageBg, section } from "./ui";


export default function App() {
  const { loadMe } = useAuth();
  useEffect(() => { loadMe(); }, [loadMe]);

  return (
    <div className={pageBg}>
      <Navbar />
      <main className={section}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Add book uses server /api/books which exists */}
          <Route path="/add" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-sm text-slate-500">
        Built with ❤️ using MERN & Tailwind
      </footer>
    </div>
  );
}
