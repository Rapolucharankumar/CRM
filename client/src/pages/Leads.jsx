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
} from "../components/UI";
import { Plus, Edit2, Trash2, Search } from "lucide-react";

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
    Qualified: "success",
    "Proposal Sent": "info",
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
    fetchLeads();
  }, [filters]);

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

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-dark">Leads</h1>
          <Button onClick={handleAddClick} variant="primary" size="lg">
            <Plus size={20} className="mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by name, company..."
              value={filters.search}
              onChange={handleSearchChange}
              icon={<Search size={18} />}
            />
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={[{ value: "", label: "All Statuses" }, ...statusOptions]}
            />
            <Select
              name="source"
              value={filters.source}
              onChange={handleFilterChange}
              options={[{ value: "", label: "All Sources" }, ...sourceOptions]}
            />
          </div>
        </Card>

        {/* Leads Table */}
        {loading ? (
          <LoadingSpinner />
        ) : leads.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 text-lg">No leads found</p>
          </Card>
        ) : (
          <>
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-dark">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">
                      Company
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">
                      Deal Value
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-dark">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-light">
                      <td className="py-4 px-4">
                        <span className="font-medium text-dark">{lead.name}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{lead.company}</td>
                      <td className="py-4 px-4 text-gray-600">{lead.email}</td>
                      <td className="py-4 px-4">
                        <Badge variant={statusColors[lead.status] || "default"}>
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 font-semibold text-dark">
                        ${lead.dealValue.toLocaleString()}
                      </td>
                      <td className="py-4 px-4 flex space-x-2">
                        <button
                          onClick={() => handleEditClick(lead)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(lead._id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: Math.max(1, filters.page - 1),
                  })
                }
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <span className="text-dark font-semibold">
                Page {pagination.currentPage} of {pagination.pages}
              </span>
              <Button
                variant="secondary"
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: Math.min(pagination.pages, filters.page + 1),
                  })
                }
                disabled={filters.page === pagination.pages}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingLead ? "Edit Lead" : "Add New Lead"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
          <Input
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleFormChange}
          />
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleFormChange}
            required
          />
          <Select
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleFormChange}
            options={sourceOptions}
          />
          <Input
            label="Deal Value"
            type="number"
            name="dealValue"
            value={formData.dealValue}
            onChange={handleFormChange}
          />
          <Input
            label="Next Follow-up"
            type="date"
            name="nextFollowUp"
            value={formData.nextFollowUp}
            onChange={handleFormChange}
          />
          <div className="flex space-x-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {editingLead ? "Update Lead" : "Create Lead"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
