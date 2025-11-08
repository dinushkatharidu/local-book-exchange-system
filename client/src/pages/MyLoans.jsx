import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../store/useAuth";
import { h2, btn, card, empty } from "../ui";

export default function MyLoans() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const load = async ()=> { const res = await api.get("/api/borrows/me"); setRows(res.data); };
  useEffect(()=>{ load(); },[]);
  const act = async (id, next) => {
    const path = next === "approved" ? "approve" : next === "borrowed" ? "borrowed" : "returned";
    await api.post(`/api/borrows/${id}/${path}`); load();
  };

  return (
    <div className="space-y-4">
      <h2 className={h2}>My Loans</h2>
      {rows.length === 0 ? (
        <div className={empty}>No borrow activity yet.</div>
      ) : (
        <div className="space-y-2">
          {rows.map(r=>(
            <div key={r._id} className={`${card} p-4`}>
              <div className="font-medium">{r.book?.title}</div>
              <div className="text-sm text-slate-500">Status: {r.status}</div>
              <div className="text-sm text-slate-500">Lender: {r.lender?.name} | Borrower: {r.borrower?.name}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {String(user?.id)===String(r.lender?._id) && r.status==="requested" && <button className={btn} onClick={()=>act(r._id,"approved")}>Approve</button>}
                {String(user?.id)===String(r.lender?._id) && r.status==="approved"  && <button className={btn} onClick={()=>act(r._id,"borrowed")}>Mark Borrowed</button>}
                {["borrowed","approved"].includes(r.status) && <button className={btn} onClick={()=>act(r._id,"returned")}>Mark Returned</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
