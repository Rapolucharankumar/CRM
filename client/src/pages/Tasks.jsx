import { useState, useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { taskService } from "../services/api";
import { Card, Button, Input, Modal, Toast, LoadingSpinner, Badge } from "../components/UI";
import { CheckSquare, Plus, Check, X, Clock, Calendar as CalendarIcon } from "lucide-react";

export const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to fetch tasks",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(formData);
      setToast({ message: "Task created successfully", type: "success" });
      setIsModalOpen(false);
      setFormData({ title: "", description: "", dueDate: "" });
      fetchTasks();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to create task",
        type: "error",
      });
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === "DONE" ? "TODO" : "DONE";
    try {
      await taskService.updateTask(task.id, { status: newStatus });
      setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)));
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to update task",
        type: "error",
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      setToast({ message: "Task deleted successfully", type: "success" });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to delete task",
        type: "error",
      });
    }
  };

  return (
    <Layout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center">
              <CheckSquare className="mr-3 text-primary-600" />
              Tasks Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">Organize your workflow and track pending to-dos</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            <Plus size={18} className="mr-2" />
            Add Task
          </Button>
        </div>

        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 border border-slate-100 group rounded-2xl">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-semibold text-base leading-snug ${task.status === "DONE" ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {task.title}
                    </h3>
                    <Badge variant={task.status === "DONE" ? "success" : "warning"}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-3 leading-relaxed">{task.description}</p>
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                  {task.dueDate ? (
                    <div className="flex items-center text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md">
                      <Clock size={14} className="mr-1.5 text-slate-400" />
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric'})}
                    </div>
                  ) : (
                    <span className="text-xs text-transparent">No Due Date</span>
                  )}
                  
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        task.status === "DONE"
                          ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                      title={task.status === "DONE" ? "Mark as pending" : "Mark as completed"}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete task"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            {tasks.length === 0 && (
              <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 bg-white border border-slate-200 border-dashed rounded-2xl">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <CheckSquare size={28} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">No tasks pending</h3>
                <p className="text-sm">You're all caught up! Click "Add Task" to create a new one.</p>
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="e.g. Follow up with client regarding proposal..."
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none text-sm resize-none"
              rows={4}
              placeholder="Add some details about this task..."
            />
          </div>
          <Input
            label="Due Date (Optional)"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
