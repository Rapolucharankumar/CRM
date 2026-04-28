import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useState, useEffect } from "react";

export const Toast = ({ message, type = "success", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
  };

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg border flex items-center space-x-3 shadow-md ${colors[type]} z-50`}
    >
      {icons[type]}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="hover:opacity-75 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

export const Card = ({ children, className = "", glass = false }) => (
  <div className={`${glass ? 'glass-card' : 'card'} p-6 ${className}`}>
    {children}
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm rounded-lg focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm rounded-lg focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 rounded-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} font-medium transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export const Input = ({ label, error, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input
      className={`input-field ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      {...props}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

export const Select = ({ label, error, options, className = "", ...props }) => (
  <div className={`flex flex-col space-y-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <select
      className={`input-field bg-white ${error ? "border-red-500 focus:ring-red-500" : ""}`}
      {...props}
    >
      <option value="">Select an option</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${maxWidth} transform transition-all overflow-hidden flex flex-col max-h-[90vh]`}>
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    primary: "bg-primary-50 text-primary-700 border border-primary-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-t-primary-600"></div>
  </div>
);

// Free API Integration: DiceBear Avatars
export const Avatar = ({ name, seed, size = 40, className = "" }) => {
  const avatarSeed = seed || name || "User";
  const url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=e2e8f0,3b82f6,8b5cf6,10b981&textColor=ffffff`;
  
  return (
    <img 
      src={url} 
      alt={`${name} avatar`} 
      width={size} 
      height={size} 
      className={`rounded-full shadow-sm border border-white ${className}`}
      loading="lazy"
    />
  );
};

// Free API Integration: Clearbit Logo
export const CompanyLogo = ({ companyName, size = 32, className = "" }) => {
  const [error, setError] = useState(false);
  // A simple heuristic to generate a domain. For production, a real domain field is better.
  const domain = companyName ? `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com` : null;

  if (!domain || error) {
    return (
      <div 
        className={`bg-slate-100 text-slate-500 font-bold rounded-lg flex items-center justify-center border border-slate-200 ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {companyName ? companyName.charAt(0).toUpperCase() : "?"}
      </div>
    );
  }

  return (
    <img 
      src={`https://logo.clearbit.com/${domain}`} 
      alt={`${companyName} logo`} 
      width={size} 
      height={size} 
      className={`rounded-lg object-contain bg-white border border-slate-100 shadow-sm ${className}`}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
