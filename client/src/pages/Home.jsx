import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import { h1, input, btn, card, skeleton, empty } from "../ui.js";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Home() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const res = await api.get("/api/books");
    let books = res.data || [];
    if (q)
      books = books.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(q.toLowerCase()) ||
          (b.author || "").toLowerCase().includes(q.toLowerCase())
      );
    if (city)
      books = books.filter((b) =>
        (b.location || "").toLowerCase().includes(city.toLowerCase())
      );
    setList(books);
    setLoading(false);
  }, [q, city]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className="space-y-8">
      <div className={`${card} p-6 md:p-8`}>
        <h1 className={h1}>Available Books</h1>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            className={`${input} sm:w-80`}
            placeholder="Search by title or author"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className={`${input} sm:w-56`}
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button className={btn} onClick={fetchList}>
            Search
          </button>
          {user && (
            <Link className={btn} to="/add">
              + Add Book
            </Link>
          )}
        </div>
      </div>

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
      ) : list.length === 0 ? (
        <div className={empty}>No books found.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map((b) => (
            <Link key={b._id} to={`/books/${b._id}`} className={`${card} p-4 hover:shadow-lg transition-shadow`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{b.title}</div>
                  <div className="text-sm text-slate-500">
                    by {b.author} • {b.location || "—"} • {b.condition}
                  </div>
                  {b.owner?.name && (
                    <div className="text-xs text-slate-400 mt-1">
                      Owner: {b.owner.name}
                    </div>
                  )}
                  {b.description && (
                    <p className="mt-2 text-slate-700">
                      {b.description.slice(0, 140)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
