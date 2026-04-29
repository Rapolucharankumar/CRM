import { useState, useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { leadService, externalApiService } from "../services/api";
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
  Globe
} from "lucide-react";

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [exchangeRates, setExchangeRates] = useState(null);
  const [currency, setCurrency] = useState("usd");

  useEffect(() => {
    fetchDashboardStats();
    fetchRates();
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

  const fetchRates = async () => {
    const rates = await externalApiService.getExchangeRates();
    if (rates && rates.usd) {
      setExchangeRates(rates.usd);
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

  const displayRevenue = exchangeRates && currency !== "usd" 
    ? (totalRevenue * exchangeRates[currency]).toLocaleString(undefined, { maximumFractionDigits: 0 })
    : totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const currencySymbol = { usd: "$", eur: "€", gbp: "£", inr: "₹", jpy: "¥" }[currency] || "$";

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

  const COLORS = ["#e11d48", "#f43f5e", "#fb923c", "#f59e0b", "#10b981", "#6366f1"];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Metric Cards
  const metrics = [
    {
      icon: Users,
      label: "Total Leads",
      value: totalLeads,
      color: "from-rose-500 to-rose-600",
      bgClass: "bg-rose-50 text-rose-600",
    },
    {
      icon: TrendingUp,
      label: "Closed Deals",
      value: closedDeals,
      color: "from-emerald-500 to-emerald-600",
      bgClass: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `${currencySymbol}${displayRevenue}`,
      color: "from-purple-500 to-purple-600",
      bgClass: "bg-purple-50 text-purple-600",
    },
    {
      icon: AlertCircle,
      label: "Overdue Follow-ups",
      value: overdueFollowups,
      color: "from-red-500 to-red-600",
      bgClass: "bg-red-50 text-red-600",
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

      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <BarChart3 className="mr-3 text-primary-600" />
              {getGreeting()}!
            </h1>
            <p className="text-slate-500 mt-1">Here's your sales overview for today.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
            <Globe size={18} className="text-slate-400 ml-1" />
            <span className="text-sm font-medium text-slate-600">Currency:</span>
            <select 
              className="bg-transparent border-none text-sm font-bold text-primary-700 focus:ring-0 cursor-pointer outline-none"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="inr">INR (₹)</option>
              <option value="jpy">JPY (¥)</option>
            </select>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${metric.bgClass} group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon size={24} strokeWidth={2} />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{metric.label}</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">
                {metric.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Status */}
          <Card className="rounded-2xl border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary-500 rounded-full"></span>
              Leads by Status
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Lead Source Distribution */}
          <Card className="rounded-2xl border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full"></span>
              Lead Sources
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {sourceChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[(index + 2) % COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Monthly Revenue */}
        <Card className="rounded-2xl border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Monthly Revenue Trend
            </h2>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                <Bar
                  dataKey="revenue"
                  fill="#e11d48"
                  name={`Revenue (${currencySymbol})`}
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
                <Bar
                  dataKey="deals"
                  fill="#10B981"
                  name="Deals Closed"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
