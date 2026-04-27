import express from "express";
import { getFriends, addFriend, getFriendTasks } from "../controllers/friendController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getFriends);
router.post("/", addFriend);
router.get("/:friendId/tasks", getFriendTasks);

export default router;