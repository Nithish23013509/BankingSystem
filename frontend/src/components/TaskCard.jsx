import { useDraggable } from "@dnd-kit/core";
import { motion } from "framer-motion";
import { GripVertical, Flag, Eye, Pencil, Trash2, CalendarDays } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "No due date";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "No due date";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function TaskCard({ task, onEdit, onDelete, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : "auto",
  };

  const priorityClass =
    task.priority === "High"
      ? "priority-high"
      : task.priority === "Low"
      ? "priority-low"
      : "priority-medium";

  const isOverdue =
    task.dueDate && new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  return (
    <motion.div
      ref={setNodeRef}
      className="task-card"
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      onClick={() => onOpen(task)}
    >
      <div className="task-top">
        <div className={`priority-badge ${priorityClass}`}>
          <Flag size={11} />
          {task.priority || "Medium"}
        </div>

        <span className="drag-hint" {...listeners} {...attributes}>
          <GripVertical size={16} />
        </span>
      </div>



      {task.description && <p className="task-desc">{task.description}</p>}

      <div className={`due-badge ${isOverdue ? "overdue" : ""}`}>
        <CalendarDays size={13} />
        {formatDate(task.dueDate)}
      </div>

      <div className="task-actions">
        <motion.button
          type="button"
          className="icon-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(task);
          }}
        >
          <Eye size={14} />
          View
        </motion.button>

        <motion.button
          type="button"
          className="icon-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
        >
          <Pencil size={14} />
          Edit
        </motion.button>

        <motion.button
          type="button"
          className="icon-btn danger"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
        >
          <Trash2 size={14} />
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}