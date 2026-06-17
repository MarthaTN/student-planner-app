export const addTask = (req: any, res: any) => {
  try {
    const tasks = readData(TASKS_PATH);

    if (!Array.isArray(tasks)) {
      return res.status(500).json({
        message: "Tasks data is corrupted"
      });
    }

    const {
      title,
      description,
      priority,
      deadline,
      userId,
      visibility
    } = req.body;

    if (!title || !priority || !deadline) {
      return res.status(400).json({
        message: "Title, priority and deadline are required"
      });
    }

    const newTask = {
      id: Date.now(),
      title,
      description,
      priority,
      deadline,
      completed: false,
      userId,
      visibility: visibility || "private",
      createdAt: new Date()
    };

    tasks.push(newTask);
    writeData(TASKS_PATH, tasks);

    return res.status(201).json({
      message: "Task created successfully",
      task: newTask
    });

  } catch (error) {
    console.error("Add task error:", error);

    return res.status(500).json({
      message: "Failed to create task"
    });
  }
};

/* =========================
   GET ALL TASKS
export const getTasks = (req: any, res: any) => {
  try {
    const tasks = readData(TASKS_PATH);

    if (!Array.isArray(tasks)) {
      return res.status(500).json({
        message: "Tasks data is corrupted"
      });
    }

    return res.json(tasks);

  } catch (error) {
    console.error("Get tasks error:", error);

    return res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};


/* =========================
   UPDATE TASK
export const updateTask = (req: any, res: any) => {
  try {
    const tasks = readData(TASKS_PATH);
    const taskId = Number(req.params.id);

    const taskIndex = tasks.findIndex((task: any) => task.id === taskId);

    if (taskIndex === -1) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...req.body
    };

    writeData(TASKS_PATH, tasks);

    return res.json({
      message: "Task updated successfully",
      task: tasks[taskIndex]
    });

  } catch (error) {
    console.error("Update task error:", error);

    return res.status(500).json({
      message: "Failed to update task"
    });
  }
};


/* =========================
   DELETE TASK
export const deleteTask = (req: any, res: any) => {
  try {
    const tasks = readData(TASKS_PATH);
    const taskId = Number(req.params.id);

    const filteredTasks = tasks.filter(
      (task: any) => task.id !== taskId
    );

    writeData(TASKS_PATH, filteredTasks);

    return res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    console.error("Delete task error:", error);

    return res.status(500).json({
      message: "Failed to delete task"
    });
  }
};


/* =========================
   MARK TASK COMPLETE
export const completeTask = (req: any, res: any) => {
  try {
    const tasks = readData(TASKS_PATH);
    const taskId = Number(req.params.id);

    const task = tasks.find((task: any) => task.id === taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.completed = true;

    writeData(TASKS_PATH, tasks);

    return res.json({
      message: "Task marked as completed",
      task
    });

  } catch (error) {
    console.error("Complete task error:", error);

    return res.status(500).json({
      message: "Failed to complete task"
    });
  }
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