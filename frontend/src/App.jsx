import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Search,
  Ticket,
  Users,
} from "lucide-react";

import Sidebar from "./components/Sidebar.jsx";
import StatCard from "./components/StatCard.jsx";
import TicketTable from "./components/TicketTable.jsx";
import TicketForm from "./components/TicketForm.jsx";
import CustomerManagement from "./components/CustomerManagement.jsx";
import EmployeeManagement from "./components/EmployeeManagement.jsx";
import TicketResponsesModal from "./components/TicketResponsesModal.jsx";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const EMPTY_STATS = {
  total: 0,
  open: 0,
  inProgress: 0,
  resolved: 0,
  closed: 0,
};

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || data.message || "Request failed.");
  }
  return data;
}

export default function App() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [activePage, setActivePage] = useState("dashboard");
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Load tickets and dashboard statistics.
  const loadDashboard = useCallback(async (showLoader = true) => {
    if (showLoader) {
      setLoading(true);
    }
    setError("");

    try {
      const [ticketsResponse, statsResponse] = await Promise.all([
        fetch(`${API_URL}/tickets`),
        fetch(`${API_URL}/stats`),
      ]);

      const [ticketData, statsData] = await Promise.all([
        readResponse(ticketsResponse),
        readResponse(statsResponse),
      ]);

      if (!Array.isArray(ticketData)) {
        throw new Error("The tickets API did not return a list.");
      }

      setTickets(ticketData);

      setStats({
        ...EMPTY_STATS,
        ...Object.fromEntries(
          Object.entries(statsData).map(([key, value]) => [
            key,
            Number(value) || 0,
          ])
        ),
      });
    } catch (err) {
      setError(
        `${err.message} Check that your backend and PostgreSQL are running.`
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (activePage === "dashboard" || activePage === "tickets") {
      loadDashboard();
    }
  }, [loadDashboard, activePage]);

  // Search and filter tickets.
  const filteredTickets = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tickets.filter((ticket) => {
      const searchableValues = [
        ticket.ticket_id,
        ticket.customer_name,
        ticket.email,
        ticket.subject,
        ticket.employee_name,
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );

      const matchesStatus =
        statusFilter === "All" || ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  // Create a ticket.
  async function handleCreateTicket(formData) {
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      await readResponse(response);

      setShowForm(false);
      setNotice("Ticket created successfully.");

      await loadDashboard(false);
    } catch (err) {
      setError(err.message || "Unable to create the ticket.");
    } finally {
      setSaving(false);
    }
  }

  // Update a ticket's status.
  async function handleStatusChange(ticketId, status) {
    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      await readResponse(response);

      setNotice(`Ticket #${ticketId} updated to ${status}.`);

      await loadDashboard(false);
    } catch (err) {
      setError(err.message || "Unable to update ticket status.");
      await loadDashboard(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] md:pl-64">
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setError("");
          setNotice("");
          setShowForm(false);
        }}
      />

      {activePage === "customers" ? (
        <main className="mx-auto min-h-screen max-w-[1700px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <CustomerManagement />
        </main>
      ) : activePage === "employees" ? (
        <main className="mx-auto min-h-screen max-w-[1700px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <EmployeeManagement />
        </main>
      ) : (
        <main className="mx-auto min-h-screen max-w-[1700px] px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
          <header className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-indigo-600">
                CUSTOMER SUPPORT
              </p>

              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {activePage === "tickets"
                  ? "All Tickets"
                  : "Support Dashboard"}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage customer requests and track their progress.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError("");
                setNotice("");
                setShowForm(true);
              }}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <Plus size={18} />
              New ticket
            </button>
          </header>

          {error && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
            >
              <AlertCircle size={20} className="mt-0.5 shrink-0" />

              <div className="flex-1">{error}</div>

              <button
                type="button"
                onClick={() => loadDashboard()}
                className="shrink-0 font-bold underline"
              >
                Retry
              </button>
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
            >
              <CheckCircle2 size={19} />

              <span className="flex-1">{notice}</span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="text-lg"
              >
                ×
              </button>
            </div>
          )}

          {activePage === "dashboard" && (
            <>
              <section className="mb-7 flex flex-wrap items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 sm:p-6">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-indigo-100 bg-white text-indigo-600">
                  <Activity size={24} />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-base font-extrabold text-slate-900">
                    Welcome to CareDesk
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Here's an overview of your customer support activity.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadDashboard()}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-white px-3 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-50 disabled:opacity-50"
                >
                  <RefreshCw
                    size={15}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh
                </button>
              </section>

              <section className="mb-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total tickets"
                  value={stats.total}
                  icon={Ticket}
                  color="blue"
                  description="All support requests"
                />

                <StatCard
                  title="Open tickets"
                  value={stats.open}
                  icon={AlertCircle}
                  color="orange"
                  description="Awaiting action"
                />

                <StatCard
                  title="In progress"
                  value={stats.inProgress}
                  icon={Clock3}
                  color="purple"
                  description="Currently being handled"
                />

                <StatCard
                  title="Resolved"
                  value={stats.resolved}
                  icon={CheckCircle2}
                  color="green"
                  description="Successfully resolved"
                />
              </section>
            </>
          )}

          <section
            id="tickets"
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
              <div>
                <h2 className="font-heading text-lg font-extrabold text-slate-900">
                  Support tickets
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  View and manage customer issues.
                </p>
              </div>

              <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">
                {filteredTickets.length}{" "}
                {filteredTickets.length === 1 ? "ticket" : "tickets"}
              </span>
            </div>

            <div className="flex flex-col gap-3 px-5 pb-5 sm:flex-row sm:px-6">
              <div className="flex min-h-11 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-3.5 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 sm:max-w-lg">
                <Search size={18} className="shrink-0 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search customer, email, subject or ID..."
                  aria-label="Search tickets"
                  className="w-full min-w-0 bg-transparent text-xs outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter tickets by status"
                className="min-h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none focus:border-indigo-400"
              >
                <option value="All">All statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            {loading ? (
              <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-sm text-slate-500">
                <RefreshCw
                  size={25}
                  className="animate-spin text-indigo-600"
                />
                Loading tickets...
              </div>
            ) : (
              <TicketTable
                tickets={filteredTickets}
                onStatusChange={handleStatusChange}
                onViewTicket={(ticket) => setSelectedTicket(ticket)}
              />
            )}
          </section>

          <footer className="flex flex-col gap-2 py-6 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>CareDesk Customer Support System</span>

            <span className="inline-flex items-center gap-2">
              <Users size={14} />
              Support management
            </span>
          </footer>
        </main>
      )}

      {showForm && activePage !== "customers" && activePage !== "employees" && (
        <TicketForm
          onClose={() => setShowForm(false)}
          onSubmit={handleCreateTicket}
          saving={saving}
        />
      )}

      {selectedTicket && (
        <TicketResponsesModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
