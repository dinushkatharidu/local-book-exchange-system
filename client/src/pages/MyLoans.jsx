import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../store/useAuth";
import { h2, btn, card, empty, label, input } from "../ui";

export default function MyLoans() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [editingDueDate, setEditingDueDate] = useState(null);
  const [newDueDate, setNewDueDate] = useState("");
  
  const load = async ()=> { 
    const res = await api.get("/api/borrows/me"); 
    setRows(res.data); 
  };
  
  useEffect(()=>{ load(); },[]);
  
  const act = async (id, next) => {
    try {
      const path = next === "approved" ? "approve" : next === "borrowed" ? "borrowed" : "returned";
      await api.post(`/api/borrows/${id}/${path}`); 
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Action failed");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this borrow request?")) {
      return;
    }
    try {
      await api.post(`/api/borrows/${id}/cancel`);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to cancel request");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this borrow request?")) {
      return;
    }
    try {
      await api.post(`/api/borrows/${id}/reject`);
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to reject request");
    }
  };

  const handleUpdateDueDate = async (id) => {
    if (!newDueDate) {
      alert("Please select a due date");
      return;
    }
    try {
      await api.put(`/api/borrows/${id}/due-date`, { dueAt: newDueDate });
      setEditingDueDate(null);
      setNewDueDate("");
      load();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to update due date");
    }
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
              <div className="text-sm text-slate-500">
                Status: <span className={
                  r.status === 'approved' ? 'text-blue-600' :
                  r.status === 'borrowed' ? 'text-orange-600' :
                  r.status === 'returned' ? 'text-green-600' :
                  r.status === 'rejected' ? 'text-red-600' :
                  'text-slate-600'
                }>
                  {r.status}
                </span>
              </div>
              <div className="text-sm text-slate-500">
                Lender: {r.lender?.name} | Borrower: {r.borrower?.name}
              </div>
              {r.dueAt && (
                <div className="text-sm text-slate-500">
                  Due: {new Date(r.dueAt).toLocaleDateString()}
                </div>
              )}
              
              {editingDueDate === r._id ? (
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="date"
                    className={`${input} w-auto`}
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <button 
                    className="text-sm text-indigo-600 hover:underline"
                    onClick={() => handleUpdateDueDate(r._id)}
                  >
                    Save
                  </button>
                  <button 
                    className="text-sm text-slate-600 hover:underline"
                    onClick={() => {
                      setEditingDueDate(null);
                      setNewDueDate("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Lender actions */}
                  {String(user?.id)===String(r.lender?._id) && r.status==="requested" && (
                    <>
                      <button className={btn} onClick={()=>act(r._id,"approved")}>Approve</button>
                      <button 
                        className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                        onClick={()=>handleReject(r._id)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {String(user?.id)===String(r.lender?._id) && r.status==="approved" && (
                    <button className={btn} onClick={()=>act(r._id,"borrowed")}>Mark Borrowed</button>
                  )}
                  {String(user?.id)===String(r.lender?._id) && (r.status==="approved" || r.status==="borrowed") && (
                    <button 
                      className="text-sm text-indigo-600 hover:underline"
                      onClick={() => {
                        setEditingDueDate(r._id);
                        setNewDueDate(r.dueAt ? new Date(r.dueAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
                      }}
                    >
                      {r.dueAt ? 'Update Due Date' : 'Set Due Date'}
                    </button>
                  )}
                  
                  {/* Borrower actions */}
                  {String(user?.id)===String(r.borrower?._id) && r.status==="requested" && (
                    <button 
                      className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                      onClick={()=>handleCancel(r._id)}
                    >
                      Cancel Request
                    </button>
                  )}
                  
                  {/* Common actions */}
                  {["borrowed","approved"].includes(r.status) && (
                    <button className={btn} onClick={()=>act(r._id,"returned")}>Mark Returned</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
