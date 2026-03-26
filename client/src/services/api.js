import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

// Lead endpoints
export const leadService = {
  createLead: (data) => api.post("/leads", data),
  getLeads: (params) => api.get("/leads", { params }),
  getLead: (id) => api.get(`/leads/${id}`),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  getDashboardStats: () => api.get("/leads/stats/dashboard"),
  getFollowUps: () => api.get("/leads/followups/list"),
};

// Deal endpoints
export const dealService = {
  createDeal: (data) => api.post("/deals", data),
  getDeals: (params) => api.get("/deals", { params }),
  updateDealStage: (id, data) => api.put(`/deals/${id}/stage`, data),
  deleteDeal: (id) => api.delete(`/deals/${id}`),
};

// Task endpoints
export const taskService = {
  createTask: (data) => api.post("/tasks", data),
  getTasks: (params) => api.get("/tasks", { params }),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;
