import { readData, writeData } from "../utils/fileHandler";

const TASKS_PATH = "data/tasks.json";

/* =========================
   ADD TASK
========================= */
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
========================= */
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
========================= */
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
========================= */
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
========================= */
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
};