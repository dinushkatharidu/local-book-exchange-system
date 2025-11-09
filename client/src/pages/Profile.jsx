import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { api } from "../api/client";
import { h1, btn, card } from "../ui";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, booksRes] = await Promise.all([
          api.get(`/api/users/${user.id}`),
          api.get("/api/books/me/list")
        ]);
        setProfile(profileRes.data);
        setUserBooks(booksRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  if (!profile) {
    return <div className="text-center text-slate-500">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className={h1}>My Profile</h1>
        <Link to="/profile/edit" className={btn}>
          Edit Profile
        </Link>
      </div>

      <div className={`${card} p-6`}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Name</label>
            <div className="text-lg">{profile.name}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Email</label>
            <div className="text-lg">{profile.email}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Role</label>
            <div className="text-lg capitalize">{profile.role || 'user'}</div>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Member Since</label>
            <div className="text-lg">
              {new Date(profile.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div className={`${card} p-6`}>
        <h2 className="text-xl font-semibold mb-4">My Books ({userBooks.length})</h2>
        {userBooks.length === 0 ? (
          <p className="text-slate-500">You haven't added any books yet.</p>
        ) : (
          <div className="space-y-2">
            {userBooks.slice(0, 5).map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="block p-3 rounded-md hover:bg-slate-50"
              >
                <div className="font-medium">{book.title}</div>
                <div className="text-sm text-slate-500">by {book.author}</div>
              </Link>
            ))}
            {userBooks.length > 5 && (
              <Link to="/my-books" className="block text-center text-indigo-600 hover:underline pt-2">
                View all {userBooks.length} books →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
