import { Request, Response } from "express";
import { readData, writeData } from "../utils/fileHandler";
import jwt from "jsonwebtoken";

const TASKS_FILE = "./data/task.json";
const USERS_FILE = "./data/users.json";

interface Task {
  id: number;
  userId: number;
  title: string;
  description: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  isPrivate: boolean;
  completed: boolean;
  createdAt: string;
}

export const getTasks = (req: any, res: Response) => {
  const userId = req.user.id;
  const tasks: Task[] = readData(TASKS_FILE);
  const userTasks = tasks.filter(task => task.userId === userId);
  res.json(userTasks);
};

export const createTask = (req: any, res: Response) => {
  const userId = req.user.id;
  const { title, description, deadline, priority, isPrivate } = req.body;

  const tasks: Task[] = readData(TASKS_FILE);
  const newTask: Task = {
    id: Date.now(),
    userId,
    title,
    description,
    deadline,
    priority,
    isPrivate: isPrivate || false,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  writeData(TASKS_FILE, tasks);
  res.status(201).json(newTask);
};

export const updateTask = (req: any, res: Response) => {
  const userId = req.user.id;
  const taskId = parseInt(req.params.id);
  const updates = req.body;

  const tasks: Task[] = readData(TASKS_FILE);
  const taskIndex = tasks.findIndex(task => task.id === taskId && task.userId === userId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  writeData(TASKS_FILE, tasks);
  res.json(tasks[taskIndex]);
};

export const deleteTask = (req: any, res: Response) => {
  const userId = req.user.id;
  const taskId = parseInt(req.params.id);

  const tasks: Task[] = readData(TASKS_FILE);
  const filteredTasks = tasks.filter(task => !(task.id === taskId && task.userId === userId));

  if (filteredTasks.length === tasks.length) {
    return res.status(404).json({ message: "Task not found" });
  }

  writeData(TASKS_FILE, filteredTasks);
  res.json({ message: "Task deleted" });
};