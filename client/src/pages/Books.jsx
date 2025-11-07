import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { h2, btn, card, empty } from "../ui";

export default function Books() {
  const [list, setList] = useState([]);
  const load = async () => { const res = await api.get("/api/books/me/list"); setList(res.data); };
  useEffect(()=>{ load(); },[]);
  const del = async (id) => { await api.delete(`/api/books/${id}`); load(); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={h2}>My Books</h2>
        <Link to="/me/books/new" className={btn}>+ Add Book</Link>
      </div>
      {list.length === 0 ? (
        <div className={empty}>No books yet. Click “Add Book” to create your first listing.</div>
      ) : (
        <div className="space-y-2">
          {list.map(b=>(
            <div key={b._id} className={`${card} p-4 flex items-center justify-between`}>
              <div>
                <div className="font-medium">{b.title}</div>
                <div className="text-sm text-slate-500">{b.author || "Unknown"} • {b.status}</div>
              </div>
              <div className="flex gap-2">
                <Link className={btn} to={`/me/books/${b._id}/edit`}>Edit</Link>
                <button className={btn} onClick={()=>del(b._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
