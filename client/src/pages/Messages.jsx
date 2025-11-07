import { useEffect, useState } from "react";
import { api } from "../api/client";
import ChatPane from "../components/ChatPane";
import { useAuth } from "../store/auth";
import { card, btn, empty } from "../ui";

export default function Messages() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [active, setActive] = useState(null);
  const [thread, setThread] = useState({ messages: [] });

  const loadList = async ()=> { const res = await api.get("/api/messages/me"); setList(res.data); };
  useEffect(()=>{ loadList(); },[]);

  useEffect(()=>{ (async()=>{
    if(active){ const res = await api.get(`/api/messages/${active._id}`); setThread(res.data); }
  })(); }, [active]);

  const send = async (body) => {
    const res = await api.post("/api/messages/send", { conversationId: active._id, body });
    setThread(t => ({ ...t, messages: [...t.messages, { ...res.data, sender:{ _id:user.id, name:"You" } }] }));
  };

  const nameFor = (uid) => String(uid)===String(user?.id) ? "You" : "Other";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className={`${card} p-3`}>
        <div className="text-sm font-semibold mb-2">Conversations</div>
        <div className="max-h-[28rem] space-y-2 overflow-y-auto">
          {list.map(c=>(
            <button key={c._id}
              className={`w-full text-left ${btn} ${active?._id===c._id ? "bg-slate-100" : ""}`}
              onClick={()=>setActive(c)}
            >
              Conversation #{String(c._id).slice(-4)}
            </button>
          ))}
          {list.length===0 && <div className={empty}>No conversations yet</div>}
        </div>
      </div>
      <div className="md:col-span-2">
        {active ? (
          <ChatPane
            messages={(thread.messages||[]).map(m=>({ ...m, sender:{ name: nameFor(m.sender?._id || m.sender) } }))}
            onSend={send}
          />
        ) : (
          <div className={empty}>Select a conversation</div>
        )}
      </div>
    </div>
  );
}
