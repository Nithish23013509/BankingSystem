import { useState } from "react";
import { motion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import api from "../api";

export default function CreateTaskModal({
  columnId,
  onClose,
  onCreated,
  prefTitle = "",
}) {

  const [title, setTitle] = useState(prefTitle || "");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const createTask = async () => {

    if (!title.trim()) return;

    setIsCreating(true);

    try {
      await api.post(
        `/columns/${columnId}/tasks`,
        {
          title,
          description,
          priority,
          dueDate,
          position: 1
        }
      );

      onCreated();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >

      <motion.div
        className="task-create-modal"
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={(e) => e.stopPropagation()}
      >

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Create New Task</h2>
          <motion.button
            className="icon-close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>

        <input
          id="create-task-title"
          placeholder="Task title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          id="create-task-description"
          rows="5"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <select
          id="create-task-priority"
          value={priority}
          onChange={(e) =>
            setPriority(e.target.value)
          }
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input
          id="create-task-duedate"
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value)
          }
        />

        <div className="modal-actions">

          <motion.button
            className="cancel-btn"
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>

          <motion.button
            className="create-btn"
            onClick={createTask}
            disabled={isCreating}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              opacity: isCreating ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={15} />
            {isCreating ? "Creating..." : "Create Task"}
          </motion.button>

        </div>

      </motion.div>

    </motion.div>
  );
}