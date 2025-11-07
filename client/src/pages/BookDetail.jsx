import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../store/auth";
import { btn, card } from "../ui";

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(()=>{ (async ()=>{
    const res = await api.get(`/api/books/${id}`);
    setBook(res.data);
  })(); }, [id]);

  const requestBorrow = async () => {
    try { await api.post("/api/borrows/request", { bookId: id }); setMsg("Borrow request sent 📨"); }
    catch (e) { setMsg(e?.response?.data?.error || "Request failed"); }
  };

  if(!book) return null;
  const isOwner = user && String(book.owner?._id || book.owner) === String(user.id);

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className={`${card} p-5 md:col-span-2`}>
        <h2 className="text-2xl font-semibold">{book.title}</h2>
        <p className="text-slate-500">by {book.author || "Unknown"} • {book.city || "—"}</p>
        {book.coverUrl && <img src={book.coverUrl} alt="" className="mt-4 w-full rounded-xl border"/>}
        <p className="mt-4 text-slate-800">{book.description || "No description"}</p>
        <div className="mt-2 text-sm text-slate-500">Tags: {(book.tags||[]).join(", ") || "—"}</div>
        <div className="mt-4">
          {!isOwner && <button className={btn} onClick={requestBorrow}>Request to Borrow</button>}
          {isOwner && <div className="text-slate-500">You own this book.</div>}
        </div>
        {msg && <div className="mt-3 rounded-md border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-900">{msg}</div>}
      </div>
      <aside className="space-y-3">
        <div className={`${card} p-4`}>
          <div className="font-medium">Owner</div>
          <div className="text-sm text-slate-500">{book.owner?.name || "—"}</div>
        </div>
      </aside>
    </div>
  );
}
