import { useState, useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { leadService } from "../services/api";
import {
  Card,
  Toast,
  LoadingSpinner,
  Badge,
  Button,
} from "../components/UI";
import { Calendar, AlertTriangle, Check } from "lucide-react";

export const FollowUps = () => {
  const [followups, setFollowups] = useState({
    todayFollowUps: [],
    overdueFollowUps: [],
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const response = await leadService.getFollowUps();
      setFollowups(response.data);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message || "Failed to fetch follow-ups",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (leadId) => {
    try {
      await leadService.updateLead(leadId, { status: "Closed" });
      setToast({
        message: "Follow-up marked as completed",
        type: "success",
      });
      fetchFollowUps();
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message || "Failed to update follow-up",
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const FollowUpCard = ({ lead, isOverdue = false }) => (
    <Card className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="font-semibold text-dark text-lg">{lead.name}</h3>
          {isOverdue && (
            <Badge variant="danger">Overdue</Badge>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-1">{lead.company}</p>
        <p className="text-gray-600 text-sm mb-2">{lead.email}</p>

        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
          <span className="flex items-center space-x-1">
            <Badge variant="default">{lead.status}</Badge>
          </span>
          <span>${lead.dealValue.toLocaleString()}</span>
          <span className="flex items-center space-x-1">
            <Calendar size={14} />
            {new Date(lead.nextFollowUp).toLocaleDateString()}
          </span>
        </div>

        {lead.notes && (
          <p className="mt-3 p-2 bg-light rounded text-sm text-gray-700">
            <strong>Notes:</strong> {lead.notes}
          </p>
        )}
      </div>

      <Button
        onClick={() => handleMarkCompleted(lead._id)}
        variant="success"
        size="sm"
        className="ml-4 flex items-center space-x-1"
      >
        <Check size={16} />
        <span>Done</span>
      </Button>
    </Card>
  );

  return (
    <Layout>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark flex items-center">
            <Calendar className="mr-3 text-primary" />
            Follow-ups
          </h1>
          <p className="text-gray-600 mt-1">
            Track and manage your upcoming and overdue follow-ups
          </p>
        </div>

        {/* Overdue Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle size={24} className="text-red-600" />
            <h2 className="text-2xl font-bold text-dark">
              Overdue Follow-ups
            </h2>
            <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-full font-semibold text-sm">
              {followups.overdueFollowUps.length}
            </span>
          </div>

          {followups.overdueFollowUps.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No overdue follow-ups. Great job!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {followups.overdueFollowUps.map((lead) => (
                <FollowUpCard
                  key={lead._id}
                  lead={lead}
                  isOverdue={true}
                />
              ))}
            </div>
          )}
        </div>

        {/* Today's Section */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Calendar size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-dark">
              Today's Follow-ups
            </h2>
            <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold text-sm">
              {followups.todayFollowUps.length}
            </span>
          </div>

          {followups.todayFollowUps.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-gray-500">No follow-ups scheduled for today</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {followups.todayFollowUps.map((lead) => (
                <FollowUpCard
                  key={lead._id}
                  lead={lead}
                  isOverdue={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
