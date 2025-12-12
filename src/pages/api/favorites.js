// pages/api/favorites.js
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = await getDb();
  const users = db.collection("User");

  if (req.method === "GET") {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        favorites: user.favorites || [],
      });
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { userId, destinationId, action } = req.body || {};

      if (!userId || !destinationId || !action) {
        return res
          .status(400)
          .json({ message: "userId, destinationId, action are required" });
      }

      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      if (action !== "add" && action !== "remove") {
        return res.status(400).json({ message: "action must be add/remove" });
      }

      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let favorites = user.favorites || [];

      if (action === "add") {
        if (!favorites.includes(destinationId)) {
          favorites.push(destinationId);
        }
      } else if (action === "remove") {
        favorites = favorites.filter((id) => id !== destinationId);
      }

      await users.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { favorites, updatedAt: new Date() } }
      );

      return res.status(200).json({
        ok: true,
        favorites,
      });
    } catch (error) {
      console.error("Error updating favorites:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Method not allowed" });
}
