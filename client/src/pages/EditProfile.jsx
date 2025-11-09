import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { api } from "../api/client";
import { h2, input, btn, card, label } from "../ui";

export default function EditProfile() {
  const { user, loadMe, signOut } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
        confirmPassword: "",
      });
      setLoading(false);
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    if (form.password && form.password !== form.confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    try {
      const updateData = {
        name: form.name,
        email: form.email,
      };

      if (form.password) {
        updateData.password = form.password;
      }

      await api.put("/api/users/me", updateData);
      setSuccess("Profile updated successfully!");
      await loadMe();
      setTimeout(() => navigate("/profile"), 1500);
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone. " +
      "You must complete or cancel all active borrow transactions first."
    )) {
      return;
    }

    try {
      await api.delete("/api/users/me");
      alert("Account deleted successfully");
      await signOut();
      navigate("/");
    } catch (ex) {
      setErr(ex?.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) {
    return <div className="text-center text-slate-500">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className={`${h2} mb-3`}>Edit Profile</h2>
      
      {err && (
        <div className="mb-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}
      
      {success && (
        <div className="mb-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={onSubmit} className={`${card} p-5 space-y-4`}>
        <div>
          <label className={label}>Name</label>
          <input
            className={input}
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className={label}>Email</label>
          <input
            className={input}
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-slate-700 mb-3">Change Password (optional)</h3>
          
          <div className="space-y-3">
            <div>
              <label className={label}>New Password</label>
              <input
                className={input}
                type="password"
                placeholder="Leave blank to keep current password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {form.password && (
              <div>
                <label className={label}>Confirm New Password</label>
                <input
                  className={input}
                  type="password"
                  required={!!form.password}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className={btn} type="submit">
            Save Changes
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>

      <div className={`${card} p-5 mt-6 border-red-200`}>
        <h3 className="text-lg font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-sm text-slate-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
