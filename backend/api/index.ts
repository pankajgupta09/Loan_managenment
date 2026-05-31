import { app } from "../src/app.js";
import { connectDb } from "../src/config/db.js";

// Initialize database connection
let isConnected = false;

const initializeApp = async () => {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }
  return app;
};

export default async function handler(req: any, res: any) {
  try {
    const appInstance = await initializeApp();
    return appInstance(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}