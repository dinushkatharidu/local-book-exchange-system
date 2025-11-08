import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { h2, input, btn, card, label } from "../ui";

export default function BookForm() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    condition: "good",
    location: "",
    description: "",
  });
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/api/books", form);
      nav("/");
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Failed to create book");
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className={`${h2} mb-3`}>Add Book</h2>
      {err && <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      <form onSubmit={onSubmit} className={`${card} p-5 space-y-3`}>
        <div><label className={label}>Title</label><input className={input} required value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/></div>
        <div><label className={label}>Author</label><input className={input} required value={form.author} onChange={e=>setForm({...form, author:e.target.value})}/></div>
        <div>
          <label className={label}>Condition</label>
          <select className={input} value={form.condition} onChange={e=>setForm({...form, condition:e.target.value})}>
            <option value="new">new</option>
            <option value="good">good</option>
            <option value="used">used</option>
          </select>
        </div>
        <div><label className={label}>Location (city)</label><input className={input} value={form.location} onChange={e=>setForm({...form, location:e.target.value})}/></div>
        <div><label className={label}>Description</label><textarea className={`${input} h-28`} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></div>
        <button className={btn} type="submit">Create book</button>
      </form>
    </div>
  );
}
