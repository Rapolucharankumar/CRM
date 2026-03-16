import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Layout } from "../layouts/Layout";
import { leadService } from "../services/api";
import { Card, Toast, LoadingSpinner, Badge } from "../components/UI";
import { GripVertical, TrendingUp } from "lucide-react";

export const Pipeline = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const statuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
    "Lost",
  ];

  const statusColors = {
    New: "bg-blue-50 border-blue-200",
    Contacted: "bg-yellow-50 border-yellow-200",
    Qualified: "bg-purple-50 border-purple-200",
    "Proposal Sent": "bg-indigo-50 border-indigo-200",
    Closed: "bg-green-50 border-green-200",
    Lost: "bg-red-50 border-red-200",
  };

  const statusBadgeColors = {
    New: "default",
    Contacted: "warning",
    Qualified: "success",
    "Proposal Sent": "info",
    Closed: "success",
    Lost: "danger",
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const response = await leadService.getLeads({ page: 1 });
      // Fetch all pages
      let allLeads = response.data.leads;

      for (let i = 2; i <= response.data.pagination.pages; i++) {
        const pageResponse = await leadService.getLeads({ page: i });
        allLeads = [...allLeads, ...pageResponse.data.leads];
      }

      setLeads(allLeads);
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
  }, []);

  // Group leads by status
  const leadsByStatus = statuses.reduce((acc, status) => {
    acc[status] = leads.filter((lead) => lead.status === status);
    return acc;
  }, {});

  // Handle drag and drop
  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const leadId = draggableId;
    const newStatus = destination.droppableId;

    try {
      await leadService.updateLead(leadId, { status: newStatus });

      // Update local state
      setLeads(
        leads.map((lead) =>
          lead._id === leadId ? { ...lead, status: newStatus } : lead
        )
      );

      setToast({
        message: `Lead updated to ${newStatus}`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to update lead",
        type: "error",
      });
      // Revert on error
      fetchLeads();
    }
  };

  // Calculate total deal value per status
  const getTotalValue = (status) => {
    return leadsByStatus[status]
      .reduce((sum, lead) => sum + lead.dealValue, 0)
      .toLocaleString();
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark flex items-center">
              <TrendingUp className="mr-3 text-primary" />
              Sales Pipeline
            </h1>
            <p className="text-gray-600 mt-1">
              Drag and drop leads between stages to update their status
            </p>
          </div>
        </div>

        {/* Kanban Board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
            {statuses.map((status) => (
              <div key={status} className="flex flex-col min-w-full lg:min-w-auto">
                {/* Column Header */}
                <Card className={`${statusColors[status]} rounded-t-lg rounded-b-none border-l-4 px-4 py-3`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-dark">{status}</h3>
                    <span className="text-xs bg-white text-dark px-2 py-1 rounded font-semibold">
                      {leadsByStatus[status].length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    ${getTotalValue(status)}
                  </p>
                </Card>

                {/* Droppable Area */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 bg-gray-50 rounded-b-lg p-3 min-h-96 ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="space-y-3">
                        {leadsByStatus[status].map((lead, index) => (
                          <Draggable
                            key={lead._id}
                            draggableId={lead._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`bg-white border border-gray-200 rounded-lg p-3 shadow-soft hover:shadow-md transition-all ${
                                  snapshot.isDragging ? "shadow-lg bg-blue-50" : ""
                                }`}
                              >
                                <div className="flex items-start space-x-2">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="pt-1 text-gray-400"
                                  >
                                    <GripVertical size={16} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-dark text-sm truncate">
                                      {lead.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 truncate">
                                      {lead.company}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {lead.email}
                                    </p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-xs font-semibold text-dark">
                                        ${lead.dealValue.toLocaleString()}
                                      </span>
                                      <Badge
                                        variant={
                                          statusBadgeColors[status] || "default"
                                        }
                                      >
                                        {lead.source}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
};
