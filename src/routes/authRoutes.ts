import express from "express";
import { signup, login, logout } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout); 

// PROTECTED ROUTE
router.get("/profile", authMiddleware, (req: any, res: any) => {
  res.json({
    message: "Protected profile data",
    user: req.user
  });
});

export default router;