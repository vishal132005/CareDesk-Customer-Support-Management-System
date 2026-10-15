import { useEffect, useState } from "react";
import { X, Send, UserCircle, Shield, RefreshCw } from "lucide-react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }
  return data;
}

export default function TicketResponsesModal({ ticket, onClose }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [responseText, setResponseText] = useState("");
  const [saving, setSaving] = useState(false);
  const [responderType, setResponderType] = useState("Employee");
  const [responderName, setResponderName] = useState("Admin User"); // Hardcoded for now since no auth

  useEffect(() => {
    async function fetchResponses() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/tickets/${ticket.ticket_id}/responses`);
        const data = await readResponse(res);
        setResponses(data);
      } catch (err) {
        setError(err.message || "Failed to load responses.");
      } finally {
        setLoading(false);
      }
    }
    fetchResponses();
  }, [ticket.ticket_id]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!responseText.trim()) return;

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/tickets/${ticket.ticket_id}/responses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          responder_name: responderName,
          responder_type: responderType,
          response_text: responseText.trim(),
        }),
      });
      const newResponse = await readResponse(res);
      setResponses((prev) => [...prev, newResponse]);
      setResponseText("");
    } catch (err) {
      setError(err.message || "Failed to add response.");
    } finally {
      setSaving(false);
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="flex h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Ticket #{ticket.ticket_id}
            </h2>
            <p className="mt-0.5 text-sm font-medium text-slate-500">
              {ticket.subject}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Original Ticket Description */}
          <div className="mb-6 flex gap-4 rounded-xl bg-slate-50 p-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
              <UserCircle size={24} />
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-slate-900">{ticket.customer_name}</span>
                <span className="text-xs text-slate-500">Customer (Original Post)</span>
              </div>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {ticket.description}
              </p>
              <div className="mt-2 text-[10px] text-slate-400">
                {formatDate(ticket.created_at)}
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-slate-100" />

          {error && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Responses */}
          {loading ? (
            <div className="flex justify-center p-8 text-slate-400">
              <RefreshCw size={24} className="animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {responses.map((resp) => (
                <div key={resp.response_id} className="flex gap-4">
                  <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    resp.responder_type === "Employee" 
                      ? "bg-indigo-100 text-indigo-700" 
                      : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {resp.responder_type === "Employee" ? <Shield size={20} /> : <UserCircle size={24} />}
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-100 p-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900">{resp.responder_name}</span>
                      <span className="text-xs text-slate-500">{resp.responder_type}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                      {resp.response_text}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400">
                      {formatDate(resp.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply Box */}
        <div className="border-t border-slate-100 bg-slate-50 p-5 rounded-b-2xl">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 flex items-center gap-3">
              <select
                value={responderType}
                onChange={(e) => setResponderType(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none"
              >
                <option value="Employee">Reply as Employee</option>
                <option value="Customer">Reply as Customer</option>
              </select>
              <input
                type="text"
                value={responderName}
                onChange={(e) => setResponderName(e.target.value)}
                placeholder="Your Name"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none"
                required
              />
            </div>
            <div className="flex gap-3">
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response..."
                className="max-h-32 min-h-12 flex-1 resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                rows={2}
                required
              />
              <button
                type="submit"
                disabled={saving || !responseText.trim()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                <Send size={16} />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
