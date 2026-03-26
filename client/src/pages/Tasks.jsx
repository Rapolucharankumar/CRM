import { useState, useEffect } from "react";
import { Layout } from "../layouts/Layout";
import { taskService } from "../services/api";
import { Card, Button, Input, Modal, Toast, LoadingSpinner, Badge } from "../components/UI";
import { CheckSquare, Plus, Check, X, Clock } from "lucide-react";

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

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-dark flex items-center">
              <CheckSquare className="mr-3 text-primary" />
              Tasks
            </h1>
            <p className="text-gray-600 mt-1">Manage your to-do items and due dates</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" />
            Add Task
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card key={task.id} className="p-5 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-semibold text-lg ${task.status === "DONE" ? "line-through text-gray-400" : "text-dark"}`}>
                      {task.title}
                    </h3>
                    <Badge variant={task.status === "DONE" ? "success" : "warning"}>
                      {task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{task.description}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  {task.dueDate ? (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={14} className="mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-xs text-transparent">No Due Date</span>
                  )}
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`p-1.5 rounded-full ${
                        task.status === "DONE"
                          ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      } transition-colors`}
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
            {tasks.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white border border-gray-200 border-dashed rounded-lg">
                No tasks found. Click "Add Task" to get started!
              </div>
            )}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Follow up with client..."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
              rows={3}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
          <div className="flex justify-end space-x-3 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
};
