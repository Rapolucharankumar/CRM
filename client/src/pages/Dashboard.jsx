import { useState, useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { leadService } from "../services/api";
import { Card, LoadingSpinner, Toast } from "../components/UI";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  BarChart3,
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await leadService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      setToast({
        message:
          error.response?.data?.message || "Failed to fetch dashboard stats",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const {
    stats: { totalLeads, closedDeals, totalRevenue, overdueFollowups },
    charts: { leadsByStatus, monthlyRevenue, sourceDistribution },
  } = stats;

  // Prepare chart data
  const statusChartData = leadsByStatus.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  const revenueChartData = monthlyRevenue.map((item) => ({
    month: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    deals: item.count,
  }));

  const sourceChartData = sourceDistribution.map((item) => ({
    name: item._id || "Unknown",
    value: item.count,
  }));

  const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#EF4444"];

  // Metric Cards
  const metrics = [
    {
      icon: Users,
      label: "Total Leads",
      value: totalLeads,
      color: "bg-blue-50 text-blue-600",
      iconColor: "text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Closed Deals",
      value: closedDeals,
      color: "bg-green-50 text-green-600",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      color: "bg-purple-50 text-purple-600",
      iconColor: "text-purple-600",
    },
    {
      icon: AlertCircle,
      label: "Overdue Follow-ups",
      value: overdueFollowups,
      color: "bg-red-50 text-red-600",
      iconColor: "text-red-600",
    },
  ];

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
            <BarChart3 className="mr-3 text-primary" />
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your sales overview.</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card
              key={index}
              className="flex items-start space-x-4 hover:shadow-md transition-all"
            >
              <div
                className={`p-3 rounded-lg ${metric.color}`}
              >
                <metric.icon className={`${metric.iconColor}`} size={24} />
              </div>
              <div className="flex-1">
                <p className="text-gray-600 text-sm">{metric.label}</p>
                <p className="text-2xl font-bold text-dark mt-1">
                  {metric.value}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Status */}
          <Card>
            <h2 className="text-lg font-bold text-dark mb-4">Leads by Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Lead Source Distribution */}
          <Card>
            <h2 className="text-lg font-bold text-dark mb-4">
              Lead Sources
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Monthly Revenue */}
        <Card>
          <h2 className="text-lg font-bold text-dark mb-4">Monthly Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#3B82F6"
                name="Revenue ($)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="deals"
                fill="#10B981"
                name="Deals Closed"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
};
