import prisma from "../config/db.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, relatedTo } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        relatedTo,
        assignedTo: req.user.id,
      },
    });

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { status, relatedTo } = req.query;
    let filter = {};

    if (req.user.role !== "ADMIN") {
      filter.assignedTo = req.user.id;
    }

    if (status) filter.status = status;
    if (relatedTo) filter.relatedTo = relatedTo;

    const tasks = await prisma.task.findMany({
      where: filter,
      orderBy: { dueDate: "asc" },
    });

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { status, title, description, dueDate } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "ADMIN" && existingTask.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const data = {};
    if (status !== undefined) data.status = status;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (dueDate !== undefined) data.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await prisma.task.update({
      where: { id: req.params.id },
      data,
    });

    res.status(200).json({ message: "Task updated", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: req.params.id },
    });

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (req.user.role !== "ADMIN" && existingTask.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.task.delete({ where: { id: req.params.id } });

    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
