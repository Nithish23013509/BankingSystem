import React from "react";
import { motion } from "framer-motion";
import { X, Flag, CalendarDays, FileText } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "Not set";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "Not set";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const priorityColors = {
  High: { bg: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "rgba(239, 68, 68, 0.15)" },
  Medium: { bg: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", border: "rgba(245, 158, 11, 0.15)" },
  Low: { bg: "rgba(34, 197, 94, 0.1)", color: "#4ade80", border: "rgba(34, 197, 94, 0.15)" },
};

export default function TaskDetailsModal({
  task,
  onClose,
}) {

  if (!task) return null;

  const pStyle = priorityColors[task.priority] || priorityColors.Medium;

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
          <h2>{task.title}</h2>
          <motion.button
            className="icon-close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={18} />
          </motion.button>
        </div>

        <div className="task-detail-box">

          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              background: pStyle.bg,
              border: `1px solid ${pStyle.border}`,
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Flag size={15} style={{ color: pStyle.color }} />
            <span style={{ fontWeight: 700, color: pStyle.color, fontSize: "0.9rem" }}>
              {task.priority} Priority
            </span>
          </motion.div>

          <motion.div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              background: "rgba(99, 102, 241, 0.06)",
              border: "1px solid rgba(99, 102, 241, 0.1)",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <CalendarDays size={15} style={{ color: "#a5b4fc" }} />
            <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.9rem" }}>
              Due: {formatDate(task.dueDate)}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}>
              <FileText size={14} />
              Description
            </div>
            <div className="detail-description">
              {task.description || "No description available"}
            </div>
          </motion.div>

        </div>

        <div className="modal-actions">
          <motion.button
            className="btn btn-primary"
            onClick={onClose}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Close
          </motion.button>
        </div>

      </motion.div>
    </motion.div>
  );
}