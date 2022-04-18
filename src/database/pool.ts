import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "wake-from-dream",
  password: "94670302",
  port: 5432,
});

export default pool;
