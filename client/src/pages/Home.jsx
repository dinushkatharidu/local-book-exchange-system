import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import BookCard from "../components/BookCard";
import { h1, input, btn, card, empty } from "../ui";

export default function Home() {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (q) params.q = q;
    if (city) params.city = city;
    const res = await api.get("/api/books", { params });
    setList(res.data);
    setLoading(false);
  }, [q, city]);

  useEffect(() => { fetchList(); }, [fetchList]);

  return (
    <div className="space-y-6">
      <h1 className={h1}>Available Books</h1>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input className={`${input} sm:w-80`} placeholder="Search title/author" value={q} onChange={e=>setQ(e.target.value)}/>
        <input className={`${input} sm:w-56`} placeholder="City" value={city} onChange={e=>setCity(e.target.value)}/>
        <button className={btn} onClick={fetchList}>Search</button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_,i)=>(
            <div key={i} className={`${card} p-4 animate-pulse`}>
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-2 h-4 w-24 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-full rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className={empty}>No books found. Try another search or add your first book after signing in.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {list.map(b => <BookCard key={b._id} book={b} />)}
        </div>
      )}
    </div>
  );
}
