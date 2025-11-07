import { btn, card, input, empty } from "../ui";
export default function ChatPane({ messages = [], onSend }) {
  let inputRef;
  return (
    <div className={`${card} h-96 p-4 flex flex-col`}>
      <div className="flex-1 space-y-2 overflow-y-auto">
        {messages.map(m => (
          <div key={m._id || m.id} className="text-sm">
            <span className="font-medium">{m.sender?.name || "You"}</span>: {m.body}
          </div>
        ))}
        {messages.length === 0 && <div className={empty}>No messages yet</div>}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={e => { e.preventDefault(); const v=inputRef.value.trim(); if(v){ onSend(v); inputRef.value=""; } }}
      >
        <input ref={el=>inputRef=el} className={input} placeholder="Type a message..." />
        <button className={btn} type="submit">Send</button>
      </form>
    </div>
  );
}
