import prisma from "../config/db.js";

// Basic Workflow Bonus: Auto-assign lead utility (simplified)
const autoAssignLead = async (leadId) => {
  // Find a sales rep (in a real app, this would be round-robin or based on load)
  const salesRep = await prisma.user.findFirst({
    where: { role: "SALES" },
  });

  if (salesRep) {
    await prisma.lead.update({
      where: { id: leadId },
      data: { assignedTo: salesRep.id },
    });
    console.log(`[NOTIFICATION] Lead ${leadId} auto-assigned to ${salesRep.name} (${salesRep.email})`);
  } else {
    console.log(`[NOTIFICATION] Lead ${leadId} created, but no sales reps found for auto-assignment.`);
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, source, dealValue, nextFollowUp } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({ message: "Name, email, and company are required" });
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email,
        phone,
        company,
        source,
        dealValue: dealValue ? parseFloat(dealValue) : 0,
        nextFollowUp: nextFollowUp ? new Date(nextFollowUp) : null,
        assignedTo: req.user.id,
      },
    });

    console.log(`[NOTIFICATION] New lead created: ${name} from ${company}`);
    // Auto assign if it wasn't assigned by someone (MVP logic here just calls the function if not admin)
    // For MVP we just use the creator as assignedTo initially, but can demonstrate the workflow
    if (req.user.role === "ADMIN") {
      await autoAssignLead(lead.id);
    }

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
    const skip = (parseInt(page) - 1) * limit;

    let filter = {};

    // Managers and admins can see all leads, sales reps see their own
    if (req.user.role !== "ADMIN") {
      filter.assignedTo = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (source) {
      filter.source = source;
    }

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where: filter,
      include: {
        user: { select: { name: true, email: true } },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.lead.count({ where: filter });

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
    const lead = await prisma.lead.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check authorization
    if (req.user.role !== "ADMIN" && lead.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ lead });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const existingLead = await prisma.lead.findUnique({
      where: { id: req.params.id },
    });

    if (!existingLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check authorization
    if (req.user.role !== "ADMIN" && existingLead.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name, email, phone, company, source, status, notes, dealValue, nextFollowUp } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (phone !== undefined) data.phone = phone;
    if (company !== undefined) data.company = company;
    if (source !== undefined) data.source = source;
    if (status !== undefined) data.status = status;
    if (notes !== undefined) data.notes = notes;
    if (dealValue !== undefined) data.dealValue = parseFloat(dealValue);
    if (nextFollowUp !== undefined) data.nextFollowUp = nextFollowUp ? new Date(nextFollowUp) : null;

    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data,
    });

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
    const existingLead = await prisma.lead.findUnique({
      where: { id: req.params.id },
    });

    if (!existingLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Check authorization
    if (req.user.role !== "ADMIN" && existingLead.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.lead.delete({
      where: { id: req.params.id },
    });

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

    if (req.user.role !== "ADMIN") {
      filter.assignedTo = req.user.id;
    }

    const totalLeads = await prisma.lead.count({ where: filter });

    const closedDeals = await prisma.lead.count({
      where: { ...filter, status: "Closed" },
    });

    const revenueResult = await prisma.lead.aggregate({
      where: { ...filter, status: "Closed" },
      _sum: { dealValue: true },
    });
    const totalRevenue = revenueResult._sum.dealValue || 0;

    const now = new Date();
    const overdueFollowups = await prisma.lead.count({
      where: {
        ...filter,
        nextFollowUp: { lt: now },
        status: { notIn: ["Closed", "LOST"] },
      },
    });

    // Grouping for status
    const leadsByStatusRaw = await prisma.lead.groupBy({
      by: ["status"],
      where: filter,
      _count: { _all: true },
    });
    const leadsByStatus = leadsByStatusRaw.map((item) => ({
      _id: item.status,
      count: item._count._all,
    }));

    // Grouping for source
    const sourceDistributionRaw = await prisma.lead.groupBy({
      by: ["source"],
      where: filter,
      _count: { _all: true },
    });
    const sourceDistribution = sourceDistributionRaw
      .filter(item => item.source !== null)
      .map((item) => ({
        _id: item.source,
        count: item._count._all,
      }));

    res.status(200).json({
      stats: {
        totalLeads,
        closedDeals,
        totalRevenue,
        overdueFollowups,
      },
      charts: {
        leadsByStatus,
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
    const tomorrowStart = new Date(now);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    let filter = {
      status: { notIn: ["Closed", "LOST"] },
    };

    if (req.user.role !== "ADMIN") {
      filter.assignedTo = req.user.id;
    }

    const todayFollowUps = await prisma.lead.findMany({
      where: {
        ...filter,
        nextFollowUp: {
          gte: now,
          lt: tomorrowStart,
        },
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { nextFollowUp: "asc" },
    });

    const overdueFollowUps = await prisma.lead.findMany({
      where: {
        ...filter,
        nextFollowUp: { lt: now },
      },
      include: { user: { select: { name: true, email: true } } },
      orderBy: { nextFollowUp: "asc" },
    });

    res.status(200).json({
      todayFollowUps,
      overdueFollowUps,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
