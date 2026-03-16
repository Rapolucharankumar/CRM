import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  CheckCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useContext(AuthContext);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Leads", icon: Users, path: "/leads" },
    { name: "Pipeline", icon: TrendingUp, path: "/pipeline" },
    { name: "Follow-ups", icon: CheckCircle, path: "/followups" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-dark text-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          CRM Pro
        </h1>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.path)
                ? "bg-primary text-white"
                : "text-gray-300 hover:bg-gray-800"
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export const Navbar = ({ onMenuToggle }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 shadow-soft z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-light rounded-lg"
        >
          <Menu size={24} />
        </button>

        <div className="flex-1"></div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-semibold text-dark">{user?.name || "User"}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0) || "U"}
          </div>
        </div>
      </div>
    </header>
  );
};

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col md:ml-64">
        <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-auto mt-16 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
