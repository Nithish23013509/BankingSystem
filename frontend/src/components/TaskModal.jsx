import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Save } from "lucide-react";
import api from "../api";

export default function TaskModal({
  task,
  onClose,
  onSaved,
}) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(
    task.description || ""
  );

  const [priority, setPriority] = useState(
    task.priority || "Medium"
  );

  const [dueDate, setDueDate] = useState(
    task.dueDate || ""
  );

  const [isSaving, setIsSaving] = useState(false);

  const saveTask = async () => {
    try {
      setIsSaving(true);
      await api.put(`/tasks/${task.id}`, {
        title,
        description,
        priority,
        dueDate,
        position: task.position || 1,
      });

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
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
        className="modal glass"
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="modal-header">
          <h2>Edit Task</h2>
          <motion.button
            className="icon-close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>

        <div className="modal-body">
          <input
            id="edit-task-title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Task title"
          />

          <textarea
            id="edit-task-description"
            rows="5"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Description"
          />

          <select
            id="edit-task-priority"
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
            id="edit-task-duedate"
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
          />
        </div>

        <div className="modal-actions">
          <motion.button
            className="btn btn-secondary"
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Cancel
          </motion.button>

          <motion.button
            className="btn btn-primary"
            onClick={saveTask}
            disabled={isSaving}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ opacity: isSaving ? 0.7 : 1 }}
          >
            <Save size={15} />
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
}