import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import KanbanBoard from "../components/KanbanBoard";
import { LogOut, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      {/* Floating particles */}
      <div className="particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <motion.header
        className="topbar glass"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="brand">
          <motion.div
            className="brand-icon"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles size={20} />
          </motion.div>
          <div>
            <h1>Kanban Task Manager</h1>
            <p>Plan, move, and finish work faster.</p>
          </div>
        </div>

        <div className="topbar-right">
          <motion.span
            className="user-chip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {user?.email}
          </motion.span>
          <motion.button
            className="btn btn-danger"
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </motion.button>
        </div>
      </motion.header>

      <motion.main
        className="page-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <KanbanBoard />
      </motion.main>
    </div>
  );
}