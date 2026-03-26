import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Layout } from "../layouts/Layout";
import { dealService } from "../services/api";
import { Card, Toast, LoadingSpinner, Badge } from "../components/UI";
import { GripVertical, TrendingUp } from "lucide-react";

export const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const statuses = [
    "PROSPECTING",
    "QUALIFICATION",
    "PROPOSAL",
    "WON",
    "LOST",
  ];

  const statusColors = {
    PROSPECTING: "bg-blue-50 border-blue-200",
    QUALIFICATION: "bg-yellow-50 border-yellow-200",
    PROPOSAL: "bg-indigo-50 border-indigo-200",
    WON: "bg-green-50 border-green-200",
    LOST: "bg-red-50 border-red-200",
  };

  const statusBadgeColors = {
    PROSPECTING: "default",
    QUALIFICATION: "warning",
    PROPOSAL: "info",
    WON: "success",
    LOST: "danger",
  };

  const fetchDeals = async () => {
    try {
      const response = await dealService.getDeals();
      setDeals(response.data.deals);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to fetch deals",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const dealsByStatus = statuses.reduce((acc, status) => {
    acc[status] = deals.filter((deal) => deal.stage === status);
    return acc;
  }, {});

  const handleDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const dealId = draggableId;
    const newStatus = destination.droppableId;

    try {
      // Optimistic update
      setDeals(
        deals.map((deal) =>
          deal.id === dealId ? { ...deal, stage: newStatus } : deal
        )
      );

      await dealService.updateDealStage(dealId, { stage: newStatus });

      setToast({
        message: `Deal updated to ${newStatus}`,
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to update deal",
        type: "error",
      });
      fetchDeals(); // revert
    }
  };

  const getTotalValue = (status) => {
    return dealsByStatus[status]
      .reduce((sum, deal) => sum + deal.value, 0)
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark flex items-center">
              <TrendingUp className="mr-3 text-primary" />
              Sales Pipeline
            </h1>
            <p className="text-gray-600 mt-1">
              Drag and drop deals between stages to update their status
            </p>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
            {statuses.map((status) => (
              <div key={status} className="flex flex-col min-w-full lg:min-w-auto">
                <Card className={`${statusColors[status]} rounded-t-lg rounded-b-none border-l-4 px-4 py-3`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-dark">{status}</h3>
                    <span className="text-xs bg-white text-dark px-2 py-1 rounded font-semibold">
                      {dealsByStatus[status].length}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    ${getTotalValue(status)}
                  </p>
                </Card>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 bg-gray-50 rounded-b-lg p-3 min-h-[400px] ${
                        snapshot.isDraggingOver ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="space-y-3">
                        {dealsByStatus[status].map((deal, index) => (
                          <Draggable
                            key={deal.id}
                            draggableId={deal.id}
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
                                      {deal.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 truncate">
                                      {deal.lead?.name || "No Lead"}
                                    </p>
                                    <div className="mt-2 flex justify-between items-center">
                                      <span className="text-xs font-semibold text-dark">
                                        ${deal.value.toLocaleString()}
                                      </span>
                                      <Badge
                                        variant={
                                          statusBadgeColors[status] || "default"
                                        }
                                      >
                                        {status}
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
