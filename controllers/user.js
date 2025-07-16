import { createUser, listUsers } from "../models/user.js";

// create users
export async function createUserController(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }

    const user = await createUser({ name, email });
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === "23505") {
      // Unique violation (email already exists)
      return res.status(409).json({ error: "Email already exists." });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
}

// List users
export async function listUsersController(req, res) {
  try {
    const users = await listUsers();
    return res.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
}
