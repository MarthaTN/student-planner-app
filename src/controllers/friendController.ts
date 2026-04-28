import { Request, Response } from "express";
import { readData, writeData } from "../utils/fileHandler";

const USERS_FILE = "./data/users.json";

export const getFriends = (req: any, res: Response) => {
  const userId = req.user.id;
  const users = readData(USERS_FILE);
  const user = users.find((u: any) => u.id === userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const friends = users.filter((u: any) => user.friends.includes(u.id));
  res.json(friends);
};

export const addFriend = (req: any, res: Response) => {
  const userId = req.user.id;
  const { friendEmail } = req.body;

  const users = readData(USERS_FILE);
  const user = users.find((u: any) => u.id === userId);
  const friend = users.find((u: any) => u.email === friendEmail);

  if (!user || !friend) return res.status(404).json({ message: "User or friend not found" });
  if (user.friends.includes(friend.id)) return res.status(400).json({ message: "Already friends" });

  user.friends.push(friend.id);
  writeData(USERS_FILE, users);
  res.json({ message: "Friend added" });
};

export const getFriendTasks = (req: any, res: Response) => {
  const userId = req.user.id;
  const friendId = parseInt(req.params.friendId);

  const users = readData(USERS_FILE);
  const user = users.find((u: any) => u.id === userId);
  if (!user || !user.friends.includes(friendId)) return res.status(403).json({ message: "Not friends" });

  const tasks = readData("./data/task.json");
  const friendTasks = tasks.filter((t: any) => t.userId === friendId && !t.isPrivate);
  res.json(friendTasks);
};