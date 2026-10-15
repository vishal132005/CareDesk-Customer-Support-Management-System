import { useEffect, useMemo, useState } from "react";
import { Search, Plus, UserCircle, X, Mail, Shield, RefreshCw } from "lucide-react";

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

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    employee_name: "",
    email: "",
    role: "Support Agent",
  });

  async function loadEmployees() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/employees`);
      const data = await readResponse(response);

      if (!Array.isArray(data)) {
        throw new Error("The employees API did not return a list.");
      }

      setEmployees(data);
    } catch (err) {
      setError(`${err.message} Check that your backend and PostgreSQL are running.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();

    return employees.filter((employee) =>
      [
        employee.employee_id,
        employee.employee_name,
        employee.email,
        employee.role,
      ].some((value) => String(value ?? "").toLowerCase().includes(term))
    );
  }, [employees, search]);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employee_name: form.employee_name.trim(),
          email: form.email.trim(),
          role: form.role.trim(),
        }),
      });

      await readResponse(response);

      setForm({
        employee_name: "",
        email: "",
        role: "Support Agent",
      });

      setShowForm(false);
      setNotice("Employee added successfully.");

      await loadEmployees();
    } catch (err) {
      setError(err.message || "Unable to add employee.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-bold tracking-[0.2em] text-indigo-600">
            TEAM MANAGEMENT
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Employees
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View and manage support agents and staff.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setNotice("");
            setShowForm(true);
          }}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          <Plus size={18} />
          Add employee
        </button>
      </header>

      {error && (
        <div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
          <button type="button" onClick={loadEmployees} className="ml-3 font-bold underline">
            Retry
          </button>
        </div>
      )}

      {notice && (
        <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          {notice}
          <button type="button" onClick={() => setNotice("")} className="ml-3 font-bold">
            Dismiss
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
              <UserCircle size={20} />
              Staff directory
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              {filteredEmployees.length} employees
            </p>
          </div>

          <div className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3.5 sm:w-80">
            <Search size={18} className="text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees..."
              aria-label="Search employees"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-500">
            <RefreshCw size={20} className="animate-spin" />
            Loading employees...
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No employees found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">ID</th>
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.employee_id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-500">
                      #{employee.employee_id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {employee.employee_name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Mail size={15} />
                        {employee.email}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      <span className="inline-flex items-center gap-2">
                        <Shield size={15} />
                        {employee.role || "Support Agent"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900">
                Add employee
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="employee_name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Employee name
                </label>
                <input
                  id="employee_name"
                  name="employee_name"
                  value={form.employee_name}
                  onChange={updateField}
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
                  placeholder="employee@caredesk.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={updateField}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
                >
                  <option value="Support Agent">Support Agent</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
