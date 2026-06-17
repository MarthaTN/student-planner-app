import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();


router.post("/add", authMiddleware, addTask);
router.get("/", authMiddleware, getTasks);
router.put("/update/:id", authMiddleware, updateTask);
router.delete("/delete/:id", authMiddleware, deleteTask);
router.patch("/complete/:id", authMiddleware, completeTask);
router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;