// client/src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Books from "./pages/Books";
import BookForm from "./pages/BookForm";
import BookDetail from "./pages/BookDetail";
import MyLoans from "./pages/MyLoans";
import Messages from "./pages/Messages";
import { useAuth } from "./store/auth";
import { section } from "./ui";

export default function App() {
  const { loadMe } = useAuth();
  useEffect(() => { loadMe(); }, [loadMe]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className={section}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/books/:id" element={<BookDetail />} />

          <Route path="/me/books" element={<ProtectedRoute><Books /></ProtectedRoute>} />
          <Route path="/me/books/new" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="/me/books/:id/edit" element={<ProtectedRoute><BookForm edit /></ProtectedRoute>} />
          <Route path="/me/loans" element={<ProtectedRoute><MyLoans /></ProtectedRoute>} />
          <Route path="/me/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
