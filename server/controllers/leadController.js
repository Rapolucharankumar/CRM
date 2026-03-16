import Lead from "../models/Lead.js";
import User from "../models/User.js";

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, dealValue, nextFollowUp } =
      req.body;

    if (!name || !email || !company) {
      return res
        .status(400)
        .json({ message: "Name, email, and company are required" });
    }

    const lead = new Lead({
      name,
      email,
      phone,
      company,
      source,
      dealValue: dealValue || 0,
      nextFollowUp,
      assignedTo: req.user.id,
    });

    await lead.save();

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { status, source, search, page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Managers and admins can see all leads, sales reps see their own
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      filter.assignedTo = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (source) {
      filter.source = source;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(filter)
      .populate("assignedTo", "name email")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(filter);

    res.status(200).json({
      leads,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      lead.assignedTo._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    let lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      lead.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, phone, company, source, status, notes, dealValue, nextFollowUp } =
      req.body;

    if (name) lead.name = name;
    if (email) lead.email = email;
    if (phone) lead.phone = phone;
    if (company) lead.company = company;
    if (source) lead.source = source;
    if (status) lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    if (dealValue !== undefined) lead.dealValue = dealValue;
    if (nextFollowUp !== undefined) lead.nextFollowUp = nextFollowUp;

    await lead.save();

    res.status(200).json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check authorization
    if (
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      lead.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    let filter = {};

    // Managers and admins see all leads, sales reps see their own
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      filter.assignedTo = req.user.id;
    }

    // Total leads
    const totalLeads = await Lead.countDocuments(filter);

    // Closed deals
    const closedDeals = await Lead.countDocuments({
      ...filter,
      status: "Closed",
    });

    // Total revenue
    const revenueData = await Lead.aggregate([
      { $match: { ...filter, status: "Closed" } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Overdue follow-ups
    const now = new Date();
    const overdueFollowups = await Lead.countDocuments({
      ...filter,
      nextFollowUp: { $lt: now },
      status: { $nin: ["Closed", "Lost"] },
    });

    // Leads by status
    const leadsByStatus = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // Monthly revenue
    const monthlyRevenue = await Lead.aggregate([
      { $match: { ...filter, status: "Closed" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$dealValue" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Lead source distribution
    const sourceDistribution = await Lead.aggregate([
      { $match: filter },
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      stats: {
        totalLeads,
        closedDeals,
        totalRevenue,
        overdueFollowups,
      },
      charts: {
        leadsByStatus,
        monthlyRevenue,
        sourceDistribution,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFollowUps = async (req, res) => {
  try {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let filter = {
      status: { $nin: ["Closed", "Lost"] },
    };

    if (req.user.role !== "admin" && req.user.role !== "manager") {
      filter.assignedTo = req.user.id;
    }

    // Today's follow-ups
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const todayFollowUps = await Lead.find({
      ...filter,
      nextFollowUp: { $gte: now, $lt: tomorrowStart },
    })
      .populate("assignedTo", "name email")
      .sort({ nextFollowUp: 1 });

    // Overdue follow-ups
    const overdueFollowUps = await Lead.find({
      ...filter,
      nextFollowUp: { $lt: now },
    })
      .populate("assignedTo", "name email")
      .sort({ nextFollowUp: 1 });

    res.status(200).json({
      todayFollowUps,
      overdueFollowUps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
