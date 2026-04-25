import fs from "fs";

export function readData(path: string) {
  try {
    const data = fs.readFileSync(path, "utf-8");

    if (!data || data.trim() === "") {
      return [];
    }

    const parsed = JSON.parse(data);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("File read error:", error);
    return [];
  }
}

export function writeData(path: string, data: any) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}