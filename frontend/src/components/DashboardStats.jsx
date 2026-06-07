import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3, ListTodo, TrendingUp } from "lucide-react";

const CHART_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
];

const statVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export default function DashboardStats({ columns, tasksByColumn }) {

  let total = 0;

  const data = columns.map((column) => {

    const count = tasksByColumn[column.id]?.length || 0;

    total += count;

    return {
      name: column.name,
      value: count,
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-sm)",
          padding: "10px 14px",
          boxShadow: "var(--shadow-md)",
        }}>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>
            {payload[0].name}
          </p>
          <p style={{ margin: "4px 0 0", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            {payload[0].value} task{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="stats-section">

      <div className="stats-grid">

        <motion.div
          className="stat-card"
          custom={0}
          variants={statVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ListTodo size={16} style={{ color: "#a5b4fc" }} />
            <h3>Total Tasks</h3>
          </div>
          <motion.p
            key={total}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {total}
          </motion.p>
        </motion.div>

        {data.map((item, index) => (
          <motion.div
            className="stat-card"
            key={item.name}
            custom={index + 1}
            variants={statVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -4, scale: 1.02 }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <TrendingUp size={16} style={{ color: CHART_COLORS[index % CHART_COLORS.length] }} />
              <h3>{item.name}</h3>
            </div>
            <motion.p
              key={item.value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.value}
            </motion.p>
          </motion.div>
        ))}

      </div>

      <motion.div
        className="chart-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <BarChart3 size={18} style={{ color: "#a5b4fc" }} />
          <h3 style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 700,
            color: "var(--text-primary)",
          }}>
            Task Distribution
          </h3>
        </div>

        <ResponsiveContainer width="100%" height={280}>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={3}
              strokeWidth={0}
              animationBegin={300}
              animationDuration={1200}
            >

              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  style={{ filter: `drop-shadow(0 0 6px ${CHART_COLORS[index % CHART_COLORS.length]}40)` }}
                />
              ))}

            </Pie>

            <Tooltip content={<CustomTooltip />} />

          </PieChart>

        </ResponsiveContainer>
      </motion.div>

    </div>
  );
}