import { Link } from "react-router-dom";
import { card, btn, textMuted } from "../ui";

export default function BookCard({ book }) {
  return (
    <div className={`${card} p-4`}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className={`text-sm ${textMuted}`}>
            by {book.author || "Unknown"} • {book.city || "—"}
          </p>
          {book.description && (
            <p className="text-slate-700">{book.description.slice(0, 140)}</p>
          )}
          {Array.isArray(book.tags) && book.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {book.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <Link to={`/books/${book._id}`} className={btn}>
          View
        </Link>
      </div>
    </div>
  );
}
