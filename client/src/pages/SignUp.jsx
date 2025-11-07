import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/auth";
import { h2, input, btn, card } from "../ui";

export default function SignUp() {
  const nav = useNavigate();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ name:"", email:"", password:"", city:"" });
  const [err, setErr] = useState("");

  const onSubmit = async (e)=>{
    e.preventDefault();
    try { await signUp(form); nav("/"); }
    catch(ex){ setErr(ex?.response?.data?.error || "Sign up failed"); }
  };

  return (
    <div className="mx-auto max-w-md">
      <h2 className={`${h2} mb-4`}>Create account</h2>
      {err && <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      <form onSubmit={onSubmit} className={`${card} p-4 space-y-3`}>
        <div><label className="block text-sm font-medium mb-1">Full name</label><input className={input} value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
        <div><label className="block text-sm font-medium mb-1">Email</label><input className={input} value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
        <div><label className="block text-sm font-medium mb-1">Password</label><input className={input} type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})}/></div>
        <div><label className="block text-sm font-medium mb-1">City (optional)</label><input className={input} value={form.city} onChange={e=>setForm({...form, city:e.target.value})}/></div>
        <button className={btn} type="submit" style={{width:"100%"}}>Sign up</button>
      </form>
      <p className="mt-3 text-sm">Have an account? <Link className="text-indigo-600 hover:underline" to="/signin">Sign in</Link></p>
    </div>
  );
}
