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
      className={`fixed top-4 right-4 p-4 rounded-lg border flex items-center space-x-3 ${colors[type]} z-50`}
    >
      {icons[type]}
      <span>{message}</span>
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

export const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-soft p-6 ${className}`}
  >
    {children}
  </div>
);

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  ...props
}) => {
  const baseClass = "font-medium rounded-lg transition-colors focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-dark hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed`}
      disabled={loading}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col space-y-2">
    {label && <label className="font-medium text-dark">{label}</label>}
    <input
      className={`px-4 py-2.5 border rounded-lg bg-white transition-colors ${
        error ? "border-red-500" : "border-gray-300"
      } focus:border-primary focus:ring-2 focus:ring-primary/20`}
      {...props}
    />
    {error && <span className="text-red-600 text-sm">{error}</span>}
  </div>
);

export const Select = ({ label, error, options, ...props }) => (
  <div className="flex flex-col space-y-2">
    {label && <label className="font-medium text-dark">{label}</label>}
    <select
      className={`px-4 py-2.5 border rounded-lg bg-white transition-colors ${
        error ? "border-red-500" : "border-gray-300"
      } focus:border-primary focus:ring-2 focus:ring-primary/20`}
      {...props}
    >
      <option value="">Select an option</option>
      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <span className="text-red-600 text-sm">{error}</span>}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-dark">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-dark"
          >
            <X size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    danger: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);
