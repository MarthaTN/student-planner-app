import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import friendRoutes from "./routes/friendRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Planner API is running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/friends", friendRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});