import dotenv from "dotenv";
dotenv.config();
import pkg from "pg";
const { Pool } = pkg;
export const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});
