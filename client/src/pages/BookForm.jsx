import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { h2, input, btn, card } from "../ui";

export default function BookForm({ edit }) {
  const nav = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ title:"", author:"", description:"", tags:"", condition:"good", city:"", coverUrl:"" });

  const load = useCallback(async () => {
    const { data: b } = await api.get(`/api/books/${id}`);
    setForm({ ...b, tags: (b.tags || []).join(",") });
  }, [id]);

  useEffect(()=>{ if (edit) load(); }, [edit, load]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(",").map(t=>t.trim()).filter(Boolean) };
    if (edit) await api.patch(`/api/books/${id}`, payload);
    else await api.post("/api/books", payload);
    nav("/me/books");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className={`${h2} mb-3`}>{edit ? "Edit Book" : "Add Book"}</h2>
      <form onSubmit={onSubmit} className={`${card} p-5 space-y-3`}>
        <div><label className="block text-sm font-medium mb-1">Title</label><input className={input} value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/></div>
        <div><label className="block text-sm font-medium mb-1">Author</label><input className={input} value={form.author} onChange={e=>setForm({...form, author:e.target.value})}/></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea className={`${input} h-28`} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></div>
        <div><label className="block text-sm font-medium mb-1">Tags (comma separated)</label><input className={input} value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})}/></div>
        <div>
          <label className="block text-sm font-medium mb-1">Condition</label>
          <select className={input} value={form.condition} onChange={e=>setForm({...form, condition:e.target.value})}>
            <option value="new">new</option><option value="good">good</option><option value="used">used</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-1">City</label><input className={input} value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/></div>
        <div><label className="block text-sm font-medium mb-1">Cover URL (optional)</label><input className={input} value={form.coverUrl} onChange={e=>setForm({...form, coverUrl:e.target.value})}/></div>
        <div className="pt-2">
          <button className={btn} type="submit">{edit ? "Save changes" : "Create book"}</button>
        </div>
      </form>
    </div>
  );
}
