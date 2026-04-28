import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CheckCircle,
  CheckSquare,
  LogOut,
  Menu,
  X,
  Bell,
  Search
} from "lucide-react";
import { Avatar } from "../components/UI";

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Pipeline", icon: TrendingUp, path: "/pipeline" },
    { name: "Tasks", icon: CheckSquare, path: "/tasks" },
    { name: "Follow-ups", icon: CheckCircle, path: "/followups" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800/60 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
              Z
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              ZoCRM Pro
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-primary-600/10 text-primary-400 font-medium"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
            >
              <item.icon size={20} className={`${isActive(item.path) ? "text-primary-500" : "text-slate-500 group-hover:text-slate-300"} transition-colors`} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-slate-900/30">
          <div className="flex items-center gap-3 px-2 mb-4">
            <Avatar name={user?.name} seed={user?.email} size={36} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-slate-400 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const Navbar = ({ onMenuToggle }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 shadow-sm z-20 md:ml-64 transition-all">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-primary-500/20 focus-within:bg-white border border-transparent focus-within:border-primary-500 transition-all w-64">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads, deals..." 
              className="bg-transparent border-none focus:ring-0 text-sm px-2 w-full text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 capitalize font-medium">{user?.role}</p>
            </div>
            <Avatar name={user?.name} seed={user?.email} size={36} className="cursor-pointer hover:ring-2 hover:ring-primary-500 hover:ring-offset-2 transition-all" />
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-64 min-w-0 transition-all">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 mt-16 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
