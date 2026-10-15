import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

const initialForm = {
  customer_name: "",
  email: "",
  subject: "",
  description: "",
  priority: "Medium",
};

export default function TicketForm({ onClose, onSubmit, saving }) {
  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setValidationError("");

    if (
      !form.customer_name.trim() ||
      !form.email.trim() ||
      !form.subject.trim() ||
      !form.description.trim()
    ) {
      setValidationError("Please fill in all required fields.");
      return;
    }

    await onSubmit({
      customer_name: form.customer_name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      description: form.description.trim(),
      priority: form.priority,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-form-title"
        className="my-auto max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-indigo-600">
              CUSTOMER SUPPORT
            </p>
            <h2
              id="ticket-form-title"
              className="mt-2 font-heading text-xl font-extrabold text-slate-900 sm:text-2xl"
            >
              Create a new ticket
            </h2>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Enter the customer information and describe the issue.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close form"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            <X size={19} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {validationError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle size={17} />
              {validationError}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-xs font-bold text-slate-700">
              Customer name <span className="text-rose-500">*</span>
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                placeholder="Rahul Sharma"
                maxLength={100}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </label>

            <label className="block text-xs font-bold text-slate-700">
              Email address <span className="text-rose-500">*</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rahul@example.com"
                maxLength={150}
                required
                className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
              />
            </label>
          </div>

          <label className="block text-xs font-bold text-slate-700">
            Issue subject <span className="text-rose-500">*</span>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Briefly describe the issue"
              maxLength={200}
              required
              className="mt-2 w-full rounded-xl border border-slate-200 px-3.5 py-3 font-normal outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="block text-xs font-bold text-slate-700">
            Complaint description <span className="text-rose-500">*</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Explain the customer's problem..."
              rows={4}
              required
              className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 font-normal leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            />
          </label>

          <label className="block text-xs font-bold text-slate-700">
            Priority
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 font-normal outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 px-5 py-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Creating ticket..." : "Create ticket"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
