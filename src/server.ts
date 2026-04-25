import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Student Planner API is running 🚀");
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});