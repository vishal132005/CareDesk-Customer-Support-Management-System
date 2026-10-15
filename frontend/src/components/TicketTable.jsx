import { Inbox } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function initials(name) {
  return String(name || "Customer")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("");
}

export default function TicketTable({ tickets, onStatusChange, onViewTicket }) {
  if (tickets.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
          <Inbox size={28} />
        </div>
        <h3 className="mt-4 font-bold text-slate-700">No tickets found</h3>
        <p className="mt-2 text-sm text-slate-500">
          Try another search or create a new support ticket.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[950px] border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {[
              "Ticket",
              "Customer",
              "Subject",
              "Priority",
              "Assigned to",
              "Status",
              "Created",
            ].map((heading) => (
              <th key={heading} className="px-4 py-4 first:pl-6">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => {
            const statusStyle = {
              Open: "bg-amber-50 text-amber-700",
              "In Progress": "bg-indigo-50 text-indigo-700",
              Resolved: "bg-emerald-50 text-emerald-700",
              Closed: "bg-slate-100 text-slate-600",
            };

            const priorityStyle = {
              Low: "bg-emerald-50 text-emerald-700",
              Medium: "bg-amber-50 text-amber-700",
              High: "bg-orange-50 text-orange-700",
              Urgent: "bg-rose-50 text-rose-700",
            };

            return (
              <tr
                key={ticket.ticket_id}
                className="border-t border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="px-4 py-4 pl-6">
                  <button 
                    onClick={() => onViewTicket && onViewTicket(ticket)}
                    className="font-bold text-indigo-600 hover:underline text-left outline-none"
                  >
                    #{ticket.ticket_id}
                  </button>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">
                      {initials(ticket.customer_name)}
                    </div>
                    <div>
                      <p className="max-w-40 truncate text-xs font-bold text-slate-800">
                        {ticket.customer_name || "Unknown"}
                      </p>
                      <p className="mt-1 max-w-40 truncate text-[10px] text-slate-400">
                        {ticket.email || "No email"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span className="block max-w-44 truncate text-xs font-semibold text-slate-600">
                    {ticket.subject || "Untitled ticket"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1.5 text-[10px] font-bold ${
                      priorityStyle[ticket.priority] || priorityStyle.Medium
                    }`}
                  >
                    {ticket.priority || "Medium"}
                  </span>
                </td>

                <td className="px-4 py-4 text-xs text-slate-500">
                  {ticket.employee_name || "Unassigned"}
                </td>

                <td className="px-4 py-4">
                  <select
                    aria-label={`Status of ticket ${ticket.ticket_id}`}
                    className={`max-w-32 rounded-lg border-0 px-2 py-2 text-[10px] font-bold outline-none ring-1 ring-inset ring-transparent focus:ring-indigo-300 ${
                      statusStyle[ticket.status] || statusStyle.Open
                    }`}
                    value={ticket.status || "Open"}
                    onChange={(event) =>
                      onStatusChange(ticket.ticket_id, event.target.value)
                    }
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                  {formatDate(ticket.created_at)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
