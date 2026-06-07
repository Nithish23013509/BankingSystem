import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion } from "framer-motion";
import { Search, Filter, LayoutGrid } from "lucide-react";

import api from "../api";
import Column from "./Column";
import DashboardStats from "./DashboardStats";
import TaskModal from "./TaskModal";
import CreateTaskModal from "./CreateTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
};

export default function KanbanBoard() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  const [columns, setColumns] = useState([]);
  const [tasksByColumn, setTasksByColumn] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [editingTask, setEditingTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createColumnId, setCreateColumnId] = useState(null);
  const [createPrefTitle, setCreatePrefTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (selectedBoardId) {
      loadBoard(selectedBoardId);
    }
  }, [selectedBoardId]);

  async function loadBoards() {
    const res = await api.get("/boards");

    setBoards(res.data);

    if (res.data.length > 0) {
      setSelectedBoardId(res.data[0].id);
    }
  }

  async function loadBoard(boardId) {
    const columnRes = await api.get(`/boards/${boardId}/columns`);

    setColumns(columnRes.data);

    const map = {};

    for (const column of columnRes.data) {
      const taskRes = await api.get(`/columns/${column.id}/tasks`);

      map[column.id] = taskRes.data;
    }

    setTasksByColumn(map);
  }

  const handleDragEnd = async ({ active, over }) => {
    if (!over) return;

    const taskId = Number(active.id);
    const targetColumnId = Number(over.id);

    let sourceColumnId = null;

    Object.keys(tasksByColumn).forEach((columnId) => {
      const found = tasksByColumn[columnId]?.find(
        (task) => task.id === taskId
      );

      if (found) {
        sourceColumnId = Number(columnId);
      }
    });

    if (
      sourceColumnId === null ||
      sourceColumnId === targetColumnId
    ) {
      return;
    }

    await api.put(`/tasks/${taskId}/move`, {
      targetColumnId,
      targetPosition: 1,
    });

    await loadBoard(selectedBoardId);
  };

  

  const deleteTask = async (task) => {
    if (!task?.id) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      await loadBoard(selectedBoardId);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const deleteColumn = async (columnId) => {
    if (!columnId || !selectedBoardId) return;
    try {
      await api.delete(`/boards/${selectedBoardId}/columns/${columnId}`);
      await loadBoard(selectedBoardId);
    } catch (err) {
      console.error("Error deleting column:", err);
    }
  };

  const filteredTasks = useMemo(() => {
    const result = {};

    columns.forEach((column) => {
      const tasks = tasksByColumn[column.id] || [];

      result[column.id] = tasks.filter((task) => {
        const searchMatch =
          !searchTerm ||
          task.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          task.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const priorityMatch =
          priorityFilter === "All" ||
          task.priority === priorityFilter;

        return searchMatch && priorityMatch;
      });
    });

    return result;
  }, [
    columns,
    tasksByColumn,
    searchTerm,
    priorityFilter,
  ]);

  return (
    <div className="board-container">

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <DashboardStats
          columns={columns}
          tasksByColumn={tasksByColumn}
        />
      </motion.div>

      <motion.div
        className="toolbar"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
          <LayoutGrid size={16} />
        </div>

        <select
          id="board-selector"
          value={selectedBoardId || ""}
          onChange={(e) =>
            setSelectedBoardId(Number(e.target.value))
          }
        >
          {boards.map((board) => (
            <option
              key={board.id}
              value={board.id}
            >
              {board.name}
            </option>
          ))}
        </select>

        <div className="search-box">
          <Search size={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            id="search-tasks"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>

        <select
          id="priority-filter"
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value)
          }
        >
          <option value="All">
            All Priorities
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>
        </select>
      </motion.div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <motion.div
          className="kanban-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {columns.map((column, index) => (
            <motion.div key={column.id} variants={itemVariants}>
              <Column
                column={column}
                tasks={filteredTasks[column.id] || []}
                onCreateTask={(colId, pref) => {
                  setCreateColumnId(colId);
                  setCreatePrefTitle(pref || "");
                  setCreateModalOpen(true);
                }}
                onEditTask={setEditingTask}
                onDeleteTask={deleteTask}
                onDeleteColumn={deleteColumn}
                onOpenTask={setViewTask}
              />
            </motion.div>
          ))}

        </motion.div>
      </DndContext>

      {editingTask && (
        <TaskModal
          task={editingTask}
          onClose={() =>
            setEditingTask(null)
          }
          onSaved={() =>
            loadBoard(selectedBoardId)
          }
        />
      )}

      {createModalOpen && (
        <CreateTaskModal
          columnId={createColumnId}
          prefTitle={createPrefTitle}
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => {
            setCreateModalOpen(false);
            loadBoard(selectedBoardId);
          }}
        />
      )}

      {viewTask && (
        <TaskDetailsModal
          task={viewTask}
          onClose={() =>
            setViewTask(null)
          }
        />
      )}

    </div>
  );
}