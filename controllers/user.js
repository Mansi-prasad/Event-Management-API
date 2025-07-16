import { createUser, listUsers } from "../models/user.js";
import { pool } from "../config/db.js";
// create users
export async function createUserController(req, res) {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    // check for exixting user
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Email already exists. Please use another email.",
      });
    }

    const user = await createUser({ name, email });
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

// List users
export async function listUsersController(req, res) {
  try {
    const users = await listUsers();
    return res.json({ success: true, users });
  } catch (error) {
    console.error("Error listing users:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}
