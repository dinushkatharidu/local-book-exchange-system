import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { container, btn } from "../ui";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className={`${container} flex h-14 items-center gap-3`}>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-lg font-semibold hover:text-indigo-600"
        >
          <span>📚</span> <span>Local Book Exchange</span>
        </Link>
        <nav className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <Link className={btn} to="/my-books">
                My Books
              </Link>
              <Link className={btn} to="/me/loans">
                My Loans
              </Link>
              <Link className={btn} to="/me/messages">
                Messages
              </Link>
              <Link className={btn} to="/profile">
                Profile
              </Link>
              <button
                className={btn}
                onClick={async () => {
                  await signOut();
                  nav("/");
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className={btn} to="/signin">
                Sign in
              </Link>
              <Link className={btn} to="/signup">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
