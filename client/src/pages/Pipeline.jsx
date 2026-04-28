import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Layout } from "../layouts/Layout";
import { dealService } from "../services/api";
import { Card, Toast, LoadingSpinner, Badge, Avatar } from "../components/UI";
import { GripVertical, TrendingUp, MoreHorizontal, Calendar } from "lucide-react";

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
    PROSPECTING: "bg-blue-50/80 border-blue-200 text-blue-700",
    QUALIFICATION: "bg-amber-50/80 border-amber-200 text-amber-700",
    PROPOSAL: "bg-purple-50/80 border-purple-200 text-purple-700",
    WON: "bg-emerald-50/80 border-emerald-200 text-emerald-700",
    LOST: "bg-red-50/80 border-red-200 text-red-700",
  };

  const statusBadgeColors = {
    PROSPECTING: "default",
    QUALIFICATION: "warning",
    PROPOSAL: "purple",
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

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <TrendingUp className="mr-3 text-primary-600" />
              Sales Pipeline
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Drag and drop deals between stages to progress your sales
            </p>
          </div>
          <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
            <button className="px-4 py-1.5 text-sm font-medium bg-slate-100 text-slate-800 rounded-md">Board</button>
            <button className="px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 rounded-md transition-colors">List</button>
          </div>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-1 gap-6 overflow-x-auto pb-4 custom-scrollbar items-start min-h-[70vh]">
            {statuses.map((status) => (
              <div key={status} className="flex flex-col min-w-[320px] w-[320px] bg-slate-100/50 rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                <div className={`${statusColors[status]} border-b border-l-4 px-4 py-3 sticky top-0 z-10 backdrop-blur-md`}>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold tracking-wide text-sm">{status}</h3>
                    <span className="text-xs bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold shadow-sm">
                      {dealsByStatus[status].length}
                    </span>
                  </div>
                  <p className="text-sm font-medium opacity-80">
                    ${getTotalValue(status)}
                  </p>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-3 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? "bg-slate-200/50" : ""
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
                                className={`bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all group ${
                                  snapshot.isDragging ? "shadow-xl ring-2 ring-primary-500 rotate-2 scale-105 z-50" : ""
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="pt-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing transition-colors"
                                  >
                                    <GripVertical size={18} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                      <h4 className="font-semibold text-slate-800 text-sm leading-tight truncate pr-2">
                                        {deal.title}
                                      </h4>
                                      <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal size={16} />
                                      </button>
                                    </div>
                                    
                                    <p className="text-xl font-bold text-slate-700 my-2">
                                      ${deal.value.toLocaleString()}
                                    </p>

                                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                                      <div className="flex items-center gap-2">
                                        <Avatar name={deal.lead?.name || "Unknown"} size={24} />
                                        <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">
                                          {deal.lead?.name || "No Lead"}
                                        </span>
                                      </div>
                                      
                                      <div className="flex items-center text-slate-400 text-xs gap-1" title="Created date">
                                        <Calendar size={12} />
                                        <span>{new Date(deal.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}</span>
                                      </div>
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
