import { useState, useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { leadService } from "../services/api";
import {
  Card,
  Toast,
  LoadingSpinner,
  Badge,
  Button,
  Avatar,
  CompanyLogo
} from "../components/UI";
import { Calendar, AlertTriangle, Check, Clock } from "lucide-react";

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
        <div className="py-20"><LoadingSpinner /></div>
      </Layout>
    );
  }

  const FollowUpCard = ({ lead, isOverdue = false }) => (
    <Card className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-md ${isOverdue ? 'border-red-200 bg-red-50/10' : 'border-slate-200 bg-white'}`}>
      <div className="flex items-start gap-4 flex-1">
        <Avatar name={lead.name} seed={lead.email} size={48} className="hidden sm:block" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-slate-800 text-base">{lead.name}</h3>
            {isOverdue && (
              <Badge variant="danger">Overdue</Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            {lead.company && <CompanyLogo companyName={lead.company} size={16} />}
            <span className="font-medium text-slate-700">{lead.company || "No Company"}</span>
            <span>&bull;</span>
            <span className="truncate">{lead.email}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
            <Badge variant={lead.status === 'New' ? 'default' : 'primary'}>{lead.status}</Badge>
            <span className="font-medium text-slate-700 px-2 py-0.5 bg-slate-100 rounded-md">
              ${lead.dealValue ? lead.dealValue.toLocaleString() : '0'}
            </span>
            <span className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${isOverdue ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
              <Clock size={12} />
              {new Date(lead.nextFollowUp).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
            </span>
          </div>

          {lead.notes && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600">
              <span className="font-semibold text-slate-700 block mb-1">Latest Notes:</span>
              <p className="line-clamp-2">{lead.notes}</p>
            </div>
          )}
        </div>
      </div>

      <Button
        onClick={() => handleMarkCompleted(lead._id)}
        variant="success"
        size="sm"
        className="w-full sm:w-auto shrink-0 shadow-sm"
      >
        <Check size={16} className="mr-1.5" />
        Mark Done
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

      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <Calendar className="mr-3 text-primary-600" />
              Follow-ups Schedule
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track and manage your upcoming and overdue client follow-ups
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center px-4 py-2 bg-red-50 rounded-lg border border-red-100">
              <span className="block text-2xl font-bold text-red-600">{followups.overdueFollowUps.length}</span>
              <span className="text-xs font-medium text-red-800 uppercase tracking-wider">Overdue</span>
            </div>
            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-100">
              <span className="block text-2xl font-bold text-blue-600">{followups.todayFollowUps.length}</span>
              <span className="text-xs font-medium text-blue-800 uppercase tracking-wider">Today</span>
            </div>
          </div>
        </div>

        {/* Overdue Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
              <AlertTriangle size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Overdue Follow-ups
            </h2>
          </div>

          {followups.overdueFollowUps.length === 0 ? (
            <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-xl">
              <p className="text-slate-500">No overdue follow-ups. Great job staying on top of things!</p>
            </div>
          ) : (
            <div className="grid gap-4">
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
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <Calendar size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              Today's Follow-ups
            </h2>
          </div>

          {followups.todayFollowUps.length === 0 ? (
            <div className="text-center py-10 bg-white border border-slate-200 border-dashed rounded-xl">
              <p className="text-slate-500">No follow-ups scheduled for today. Take a breather or find new leads!</p>
            </div>
          ) : (
            <div className="grid gap-4">
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
