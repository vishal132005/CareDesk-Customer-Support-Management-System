import {
  Headphones,
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  Shield,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { label: "All Tickets", page: "tickets", icon: Ticket },
  { label: "Customers", page: "customers", icon: Users },
  { label: "Employees", page: "employees", icon: Shield },
];

export default function Sidebar({
  activePage = "dashboard",
  onNavigate,
}) {
  return (
    <aside className="flex min-h-screen w-full shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:fixed md:left-0 md:top-0 md:w-64">
      <div className="mb-9 flex items-center gap-3 px-2">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
          <Headphones size={25} />
        </div>

        <div>
          <h2 className="font-heading text-xl font-extrabold tracking-tight">
            CareDesk
          </h2>
          <p className="text-xs text-slate-500">Support Portal</p>
        </div>
      </div>

      <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-400">
        WORKSPACE
      </p>

      <nav className="flex gap-2 overflow-x-auto md:flex-col">
        {navigation.map(({ label, page, icon: Icon }) => (
          <button
            key={page}
            type="button"
            onClick={() => {
              console.log("Sidebar clicked:", page);
              onNavigate?.(page);
            }}
            aria-current={activePage === page ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              activePage === page
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-500 hover:bg-slate-50 hover:text-indigo-700"
            }`}
          >
            <Icon size={19} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto hidden items-center gap-3 border-t border-slate-100 pt-5 md:flex">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-xs font-bold text-violet-700">
          CS
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800">Support Team</p>
          <p className="mt-1 text-xs text-slate-500">Management panel</p>
        </div>

        <Settings size={17} className="ml-auto text-slate-400" />
      </div>
    </aside>
  );
}
