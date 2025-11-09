import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { h1, btn, card, skeleton, empty } from "../ui";

export default function MyBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/books/me/list");
      setBooks(res.data || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load your books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleDelete = async (bookId, bookTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${bookTitle}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/books/${bookId}`);
      setBooks(books.filter(b => b._id !== bookId));
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to delete book");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={h1}>My Books</h1>
        <Link to="/add" className={btn}>
          + Add Book
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`${card} p-4`}>
              <div className={`${skeleton} h-5 w-40`} />
              <div className={`${skeleton} mt-2 h-4 w-24`} />
              <div className={`${skeleton} mt-4 h-4 w-full`} />
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className={empty}>
          <p>You haven't added any books yet.</p>
          <Link to="/add" className={`${btn} mt-4`}>
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {books.map((book) => (
            <div key={book._id} className={`${card} p-4`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="text-lg font-semibold">{book.title}</div>
                  <div className="text-sm text-slate-500">
                    by {book.author} • {book.location || "—"} • {book.condition}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    Status: <span className={book.status === 'borrowed' ? 'text-orange-600' : 'text-green-600'}>
                      {book.status || 'available'}
                    </span>
                  </div>
                  {book.description && (
                    <p className="mt-2 text-slate-700">
                      {book.description.slice(0, 100)}
                      {book.description.length > 100 ? '...' : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link
                  to={`/books/${book._id}`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  View
                </Link>
                <Link
                  to={`/books/${book._id}/edit`}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Edit
                </Link>
                {book.status !== 'borrowed' && (
                  <button
                    onClick={() => handleDelete(book._id, book.title)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
