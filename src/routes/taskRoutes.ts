import express from "express";
import {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
  completeTask
} from "../controllers/taskController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

/* =========================
   TASK ROUTES
========================= */

router.post("/add", authMiddleware, addTask);
router.get("/", authMiddleware, getTasks);
router.put("/update/:id", authMiddleware, updateTask);
router.delete("/delete/:id", authMiddleware, deleteTask);
router.patch("/complete/:id", authMiddleware, completeTask);

export default router;