import { pool } from "../config/db.js";

// Create a user
export async function createUser({ name, email }) {
  const insertQuery = `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await pool.query(insertQuery, [name, email]);
  return rows[0];
}

// Get all users
export async function listUsers() {
  const { rows } = await pool.query(`SELECT * FROM users ORDER BY id`);
  return rows;
}
