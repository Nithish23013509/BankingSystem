import { useDroppable } from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus } from "lucide-react";
import TaskCard from "./TaskCard";

export default function Column({
  column,
  tasks,
  onCreateTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onOpenTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      className={`column glass ${isOver ? "column-over" : ""}`}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="column-header">
        <h3>{column.name}</h3>
        <div className="column-header-right">
          <motion.span
            className="task-count"
            key={tasks.length}
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            {tasks.length}
          </motion.span>
          
          <motion.button
            className="column-add-task"
            onClick={() => onCreateTask(column.id)}
            title="Add task"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus size={14} />
          </motion.button>

          <motion.button
            className="column-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteColumn(column.id);
            }}
            title="Delete column"
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={14} />
          </motion.button>
        </div>
      </div>

      <div className="task-list">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onOpen={onOpenTask}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}