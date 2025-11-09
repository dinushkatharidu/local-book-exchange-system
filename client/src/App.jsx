import { Routes, Route, Navigate, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";


import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import BookForm from "./pages/BookForm";
import BookDetail from "./pages/BookDetail";
import MyBooks from "./pages/MyBooks";
import EditBook from "./pages/EditBook";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
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
          <Route path="/books/:id" element={<BookDetail />} />
          {/* Protected routes */}
          <Route path="/add" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="/my-books" element={<ProtectedRoute><MyBooks /></ProtectedRoute>} />
          <Route path="/books/:id/edit" element={<ProtectedRoute><EditBook /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="py-6 text-center text-sm text-slate-500">
        Built with ❤️ using MERN & Tailwind
      </footer>
    </div>
  );
}
