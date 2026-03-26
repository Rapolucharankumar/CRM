import prisma from "../config/db.js";

export const createDeal = async (req, res) => {
  try {
    const { title, value, stage, leadId } = req.body;

    if (!title || value === undefined) {
      return res.status(400).json({ message: "Title and value are required" });
    }

    const deal = await prisma.deal.create({
      data: {
        title,
        value: parseFloat(value),
        stage: stage || "PROSPECTING",
        leadId: leadId || null,
        assignedTo: req.user.id,
      },
      include: { lead: { select: { name: true, company: true } } },
    });

    res.status(201).json({ message: "Deal created successfully", deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDeals = async (req, res) => {
  try {
    const { stage, search } = req.query;
    let filter = {};

    if (req.user.role !== "ADMIN") {
      filter.assignedTo = req.user.id;
    }

    if (stage) {
      filter.stage = stage;
    }

    if (search) {
      filter.title = { contains: search, mode: "insensitive" };
    }

    const deals = await prisma.deal.findMany({
      where: filter,
      include: {
        lead: { select: { id: true, name: true, company: true } },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ deals });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDealStage = async (req, res) => {
  try {
    const { stage } = req.body;
    
    if (!stage) {
      return res.status(400).json({ message: "Stage is required" });
    }

    const existingDeal = await prisma.deal.findUnique({
      where: { id: req.params.id },
    });

    if (!existingDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (req.user.role !== "ADMIN" && existingDeal.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const deal = await prisma.deal.update({
      where: { id: req.params.id },
      data: { stage },
      include: { lead: { select: { name: true, company: true } } },
    });

    // If deal won, update the dealValue on lead? Bonus feature
    if (stage === "WON" && deal.leadId) {
       await prisma.lead.update({
         where: { id: deal.leadId },
         data: { status: "WON", dealValue: deal.value }
       });
    }

    res.status(200).json({ message: "Deal stage updated", deal });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDeal = async (req, res) => {
  try {
    const existingDeal = await prisma.deal.findUnique({
      where: { id: req.params.id },
    });

    if (!existingDeal) {
      return res.status(404).json({ message: "Deal not found" });
    }

    if (req.user.role !== "ADMIN" && existingDeal.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.deal.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Deal deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
