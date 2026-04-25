import { readData, writeData } from "../utils/fileHandler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const USERS_PATH = "data/users.json";
const SECRET = "secret_key";

/* =========================
   SIGNUP
========================= */
export const signup = async (req: any, res: any) => {
  try {
    const users = readData(USERS_PATH);

    // 🔒 safety check
    if (!Array.isArray(users)) {
      return res.status(500).json({ message: "Users data is corrupted" });
    }

    const { name, email, password } = req.body;

    // check duplicate email
    const existingUser = users.find((u: any) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      friends: [],
      profileImage: "",
      backgroundImage: ""
    };

    users.push(newUser);
    writeData(USERS_PATH, users);

    return res.status(201).json({ message: "User created" });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Signup failed" });
  }
};


/* =========================
   LOGIN
========================= */
export const login = async (req: any, res: any) => {
  try {
    const users = readData(USERS_PATH);

    // 🔒 safety check (THIS FIXES YOUR 500 ERROR)
    if (!Array.isArray(users)) {
      return res.status(500).json({ message: "Users data is corrupted" });
    }

    const { email, password } = req.body;

    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logout = async (req: any, res: any) => {
  return res.json({
    message: "Logout successful. Please remove token on client side."
  });
};