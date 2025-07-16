import { pool } from "../config/db.js";

export async function createEvent({
  title,
  event_datetime,
  location,
  capacity,
}) {
  const insertQuery = `
    INSERT INTO events (title, event_datetime, location, capacity)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const { rows } = await pool.query(insertQuery, [
    title,
    event_datetime,
    location,
    capacity,
  ]);
  return rows[0];
}

export async function getEventById(id) {
  const { rows } = await pool.query(`SELECT * FROM events WHERE id = $1`, [id]);
  return rows[0];
}

export async function listEvents() {
  const { rows } = await pool.query(
    `SELECT * FROM events ORDER BY event_datetime`
  );
  return rows;
}
