import { pool } from "../config/db.js";


export async function registerUserToEvent({ user_id, event_id }) {
  const insertQuery = `
    INSERT INTO event_registrations (event_id, user_id)
    VALUES ($1, $2)
    RETURNING *
  `;
  const { rows } = await pool.query(insertQuery, [event_id, user_id]);
  return rows[0];
}

export async function listUsersForEvent(event_id) {
  const query = `
    SELECT u.*
    FROM event_registrations er
    JOIN users u ON u.id = er.user_id
    WHERE er.event_id = $1
  `;
  const { rows } = await pool.query(query, [event_id]);
  return rows;
}

export async function listEventsForUser(user_id) {
  const query = `
    SELECT e.*
    FROM event_registrations er
    JOIN events e ON e.id = er.event_id
    WHERE er.user_id = $1
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
}
