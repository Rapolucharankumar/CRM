import { useState, useEffect, useContext } from "react";
import { Layout } from "../layouts/Layout";
import { leadService } from "../services/api";
import {
  Button,
  Card,
  Input,
  Select,
  Modal,
  Toast,
  LoadingSpinner,
  Badge,
  Avatar,
  CompanyLogo
} from "../components/UI";
import { Plus, Edit2, Trash2, Search, MoreVertical, Filter, Download } from "lucide-react";

export const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [filteredLeads, setFilteredLeads] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    source: "",
    search: "",
    page: 1,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    dealValue: 0,
    nextFollowUp: "",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Contacted", label: "Contacted" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal Sent", label: "Proposal Sent" },
    { value: "Closed", label: "Closed" },
    { value: "Lost", label: "Lost" },
  ];

  const sourceOptions = [
    { value: "Website", label: "Website" },
    { value: "Phone", label: "Phone" },
    { value: "Email", label: "Email" },
    { value: "Referral", label: "Referral" },
    { value: "Social Media", label: "Social Media" },
    { value: "Other", label: "Other" },
  ];

  const statusColors = {
    New: "default",
    Contacted: "warning",
    Qualified: "primary",
    "Proposal Sent": "purple",
    Closed: "success",
    Lost: "danger",
  };

  // Fetch leads
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadService.getLeads(filters);
      setLeads(response.data.leads);
      setPagination(response.data.pagination);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to fetch leads",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [filters.search, filters.status, filters.source, filters.page]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value, page: 1 });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value, page: 1 });
  };

  const handleAddClick = () => {
    setEditingLead(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      source: "Website",
      dealValue: 0,
      nextFollowUp: "",
    });
    setShowModal(true);
  };

  const handleEditClick = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      source: lead.source,
      dealValue: lead.dealValue,
      nextFollowUp: lead.nextFollowUp
        ? new Date(lead.nextFollowUp).toISOString().split("T")[0]
        : "",
    });
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "dealValue" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLead) {
        await leadService.updateLead(editingLead._id, formData);
        setToast({ message: "Lead updated successfully", type: "success" });
      } else {
        await leadService.createLead(formData);
        setToast({ message: "Lead created successfully", type: "success" });
      }
      setShowModal(false);
      fetchLeads();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to save lead",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      await leadService.deleteLead(id);
      setToast({ message: "Lead deleted successfully", type: "success" });
      fetchLeads();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to delete lead",
        type: "error",
      });
    }
  };

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Leads Management</h1>
            <p className="text-sm text-slate-500 mt-1">Manage and track your potential customers</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" className="hidden sm:flex">
              <Download size={18} className="mr-2" />
              Export
            </Button>
            <Button onClick={handleAddClick} variant="primary">
              <Plus size={18} className="mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters and Table Card */}
        <Card className="!p-0 border-slate-200">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="w-full md:w-1/3 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads by name or email..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                />
              </div>
              <div className="w-full md:w-auto flex gap-3">
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3">
                  <Filter size={16} className="text-slate-400" />
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="py-2 text-sm text-slate-600 bg-transparent border-none focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3">
                  <select
                    name="source"
                    value={filters.source}
                    onChange={handleFilterChange}
                    className="py-2 text-sm text-slate-600 bg-transparent border-none focus:ring-0 outline-none cursor-pointer"
                  >
                    <option value="">All Sources</option>
                    {sourceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          {loading ? (
            <div className="py-20"><LoadingSpinner /></div>
          ) : leads.length === 0 ? (
            <div className="text-center py-20 bg-white">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No leads found</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">We couldn't find any leads matching your current filters. Try adjusting your search or add a new lead.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Lead Details</th>
                    <th className="py-4 px-6 font-semibold">Company</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Deal Value</th>
                    <th className="py-4 px-6 font-semibold">Source</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar name={lead.name} seed={lead.email} size={36} />
                          <div>
                            <p className="font-medium text-slate-900">{lead.name}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {lead.company && <CompanyLogo companyName={lead.company} size={24} />}
                          <span className="text-slate-700">{lead.company || "-"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={statusColors[lead.status] || "default"}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-slate-700">
                          ${lead.dealValue ? lead.dealValue.toLocaleString() : "0"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-600">{lead.source}</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditClick(lead)}
                            className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="More options"
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && leads.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-white rounded-b-xl">
              <span className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">{(pagination.currentPage - 1) * 10 + 1}</span> to <span className="font-medium text-slate-900">{Math.min(pagination.currentPage * 10, pagination.total)}</span> of <span className="font-medium text-slate-900">{pagination.total}</span> leads
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1 px-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setFilters({ ...filters, page: i + 1 })}
                      className={`w-7 h-7 rounded flex items-center justify-center text-sm ${
                        pagination.currentPage === i + 1 
                          ? "bg-primary-50 text-primary-600 font-medium" 
                          : "text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setFilters({ ...filters, page: Math.min(pagination.pages, filters.page + 1) })}
                  disabled={filters.page === pagination.pages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLead ? "Edit Lead" : "Add New Lead"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              placeholder="e.g. Jane Doe"
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              placeholder="e.g. jane@company.com"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleFormChange}
              placeholder="e.g. +1 234 567 8900"
            />
            <Input
              label="Company"
              name="company"
              value={formData.company}
              onChange={handleFormChange}
              required
              placeholder="e.g. Acme Corp"
            />
            <Select
              label="Lead Source"
              name="source"
              value={formData.source}
              onChange={handleFormChange}
              options={sourceOptions}
            />
            <Input
              label="Deal Value ($)"
              type="number"
              name="dealValue"
              value={formData.dealValue}
              onChange={handleFormChange}
              placeholder="0"
            />
            <Input
              label="Next Follow-up"
              type="date"
              name="nextFollowUp"
              value={formData.nextFollowUp}
              onChange={handleFormChange}
              className="md:col-span-2"
            />
          </div>
          
          <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {editingLead ? "Save Changes" : "Create Lead"}
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
