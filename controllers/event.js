import { pool } from "../config/db.js";
import { DateTime } from "luxon"; // For date comparison

// Create Event
export async function createEvent(req, res) {
  try {
    const { title, event_datetime, location, capacity } = req.body;

    if (!title || !event_datetime || capacity === undefined) {
      return res.status(400).json({
        success: false,
        error: "Title, date/time, and capacity are required.",
      });
    }

    if (typeof capacity !== "number" || capacity <= 0 || capacity > 1000) {
      return res.status(400).json({
        success: false,
        error: "Capacity must be between 1 and 1000.",
      });
    }

    // check for existing event title
    const checkTitle = `SELECT id FROM events WHERE title = $1`;
    const checkTitleExists = await pool.query(checkTitle, [title]);

    if (checkTitleExists.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error:
          "An event with this title already exists. Please use another title.",
      });
    }
    // Insert new event
    const insertQuery = `
      INSERT INTO events (title, event_datetime, location, capacity)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;

    const { rows } = await pool.query(insertQuery, [
      title,
      event_datetime,
      location,
      capacity,
    ]);
    return res.status(201).json({ success: true, eventId: rows[0].id });
  } catch (error) {
    console.error("Error creating event:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

// Get Event Details (registered users)
export async function getEventDetails(req, res) {
  try {
    const eventId = Number(req.params.id);
    if (isNaN(eventId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid event ID." });
    }

    const eventResult = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (eventResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Event not found." });
    }

    const registrationsResult = await pool.query(
      `
      SELECT u.id, u.name, u.email
      FROM event_registrations er
      JOIN users u ON u.id = er.user_id
      WHERE er.event_id = $1
    `,
      [eventId]
    );

    const event = eventResult.rows[0];
    event.registrations = registrationsResult.rows;

    return res.json({ success: true, event });
  } catch (error) {
    console.error("Error fetching event details:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

// Register for Event
export async function registerForEvent(req, res) {
  try {
    const eventId = Number(req.params.id);
    const { user_id } = req.body;

    if (isNaN(eventId) || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "Event ID and user_id are required." });
    }

    // Check if event exists
    const eventRes = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (eventRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Event not found." });
    }
    const event = eventRes.rows[0];

    // check for if user exists
    const userRes = await pool.query(`SELECT id FROM users WHERE id = $1`, [
      user_id,
    ]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    // Check if event is in the past
    const now = DateTime.utc();
    const eventDate = DateTime.fromISO(event.event_datetime);
    if (eventDate < now) {
      return res
        .status(400)
        .json({ success: false, error: "Cannot register for past events." });
    }

    // Check for duplicate registration
    const regRes = await pool.query(
      `
      SELECT 1 FROM event_registrations WHERE event_id = $1 AND user_id = $2
    `,
      [eventId, user_id]
    );
    if (regRes.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: "User is already registered for this event.",
      });
    }

    // Check if event is full
    const countRes = await pool.query(
      `
      SELECT COUNT(*) FROM event_registrations WHERE event_id = $1
    `,
      [eventId]
    );
    const registrationsCount = Number(countRes.rows[0].count);
    if (registrationsCount >= event.capacity) {
      return res.status(400).json({ success: false, error: "Event is full." });
    }

    // Register user
    await pool.query(
      `
      INSERT INTO event_registrations (event_id, user_id)
      VALUES ($1, $2)
    `,
      [eventId, user_id]
    );

    return res
      .status(201)
      .json({ success: true, message: "Registration successful." });
  } catch (error) {
    console.error("Error registering for event:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

// Cancel Registration
export async function cancelRegistration(req, res) {
  try {
    const eventId = Number(req.params.id);
    const { user_id } = req.body;

    if (isNaN(eventId) || !user_id) {
      return res
        .status(400)
        .json({ success: false, error: "Event ID and user_id are required." });
    }

    // Check if registration exists
    const regRes = await pool.query(
      `
      SELECT 1 FROM event_registrations WHERE event_id = $1 AND user_id = $2
    `,
      [eventId, user_id]
    );

    if (regRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User is not registered for this event.",
      });
    }

    await pool.query(
      `
      DELETE FROM event_registrations WHERE event_id = $1 AND user_id = $2
    `,
      [eventId, user_id]
    );

    return res.json({ success: true, message: "Registration cancelled." });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

// List Upcoming Events
export async function listUpcomingEvents(req, res) {
  try {
    const now = DateTime.utc().toISO();

    const query = `
      SELECT * FROM events
      WHERE event_datetime > $1
      ORDER BY event_datetime ASC, location ASC
    `;

    const { rows } = await pool.query(query, [now]);
    return res.json(rows);
  } catch (error) {
    console.error("Error listing events:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}

// Event Status
export async function getEventStatus(req, res) {
  try {
    const eventId = Number(req.params.id);
    if (isNaN(eventId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid event ID." });
    }

    const eventRes = await pool.query(`SELECT * FROM events WHERE id = $1`, [
      eventId,
    ]);
    if (eventRes.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Event not found." });
    }

    const event = eventRes.rows[0];

    const countRes = await pool.query(
      `
      SELECT COUNT(*) FROM event_registrations WHERE event_id = $1
    `,
      [eventId]
    );

    const totalRegistrations = Number(countRes.rows[0].count);
    const remainingCapacity = event.capacity - totalRegistrations;
    const percentageUsed = (
      (totalRegistrations / event.capacity) *
      100
    ).toFixed(2);

    return res.json({
      success: true,
      totalRegistrations,
      remainingCapacity,
      percentageUsed: `${percentageUsed}%`,
    });
  } catch (error) {
    console.error("Error fetching event status:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error." });
  }
}
