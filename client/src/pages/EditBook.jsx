import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { h2, input, btn, card, label } from "../ui";

export default function EditBook() {
  const { id } = useParams();
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    condition: "good",
    location: "",
    description: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/books/${id}`);
        const book = res.data;
        setForm({
          title: book.title || "",
          author: book.author || "",
          condition: book.condition || "good",
          location: book.location || "",
          description: book.description || "",
        });
      } catch (ex) {
        setErr(ex?.response?.data?.message || "Failed to load book");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await api.put(`/api/books/${id}`, form);
      nav("/my-books");
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Failed to update book");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-center text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className={`${h2} mb-3`}>Edit Book</h2>
      {err && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}
      <form onSubmit={onSubmit} className={`${card} p-5 space-y-3`}>
        <div>
          <label className={label}>Title</label>
          <input
            className={input}
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Author</label>
          <input
            className={input}
            required
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Condition</label>
          <select
            className={input}
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
          >
            <option value="new">new</option>
            <option value="good">good</option>
            <option value="used">used</option>
          </select>
        </div>
        <div>
          <label className={label}>Location (city)</label>
          <input
            className={input}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea
            className={`${input} h-28`}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex gap-2">
          <button className={btn} type="submit">
            Update Book
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => nav("/my-books")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
