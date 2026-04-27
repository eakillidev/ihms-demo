require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    !process.env.DATABASE_URL ||
    process.env.DATABASE_URL.includes("localhost") ||
    process.env.DATABASE_URL.includes("127.0.0.1")
      ? false
      : { rejectUnauthorized: false },
});

const mapDeviceRow = (row) => ({
  id: row.id,
  name: row.name,
  type: row.type,
  status: row.status,
  power: Number(row.power),
  hasWifi: row.has_wifi,
  hasAlert: row.has_alert,
  isHighUsage: row.is_high_usage,
  customTimer: row.custom_timer,
  runtime: row.runtime,
});

const seedDevices = [
  ["1", "Living Room TV", "tv", "on", 120, true, false, false, null, 3240],
  ["2", "Gaming Console", "gaming", "on", 165, true, false, false, 900, 7845],
  ["3", "Kitchen Stove", "stove", "off", 0, true, false, false, null, 0],
  ["4", "Washer", "washer", "on", 450, true, false, false, null, 1620],
  ["5", "Bedroom TV", "tv", "off", 0, true, false, false, null, 0],
  ["6", "Office Monitor", "tv", "off", 0, true, false, false, null, 0],
];

const initDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'off' CHECK (status IN ('on', 'off')),
      power INTEGER NOT NULL DEFAULT 0,
      has_wifi BOOLEAN NOT NULL DEFAULT true,
      has_alert BOOLEAN NOT NULL DEFAULT false,
      is_high_usage BOOLEAN NOT NULL DEFAULT false,
      custom_timer INTEGER,
      runtime INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const countResult = await pool.query("SELECT COUNT(*) FROM devices");
  if (Number(countResult.rows[0].count) === 0) {
    for (const device of seedDevices) {
      await pool.query(
        `INSERT INTO devices
          (id, name, type, status, power, has_wifi, has_alert, is_high_usage, custom_timer, runtime)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        device
      );
    }
  }
};

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "backend is working",
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    console.error("database error:", error);
    res.status(500).json({ error: "database connection failed" });
  }
});

app.get("/api/devices", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM devices ORDER BY created_at ASC");
    res.json(result.rows.map(mapDeviceRow));
  } catch (error) {
    console.error("get devices error:", error);
    res.status(500).json({ error: "failed to load devices" });
  }
});

app.post("/api/devices", async (req, res) => {
  const {
    id,
    name,
    type,
    status = "off",
    power = 0,
    hasWifi = true,
    hasAlert = false,
    isHighUsage = false,
    customTimer = null,
    runtime = 0,
  } = req.body;

  if (!id || !name || !type) {
    return res.status(400).json({ error: "id, name, and type are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO devices
        (id, name, type, status, power, has_wifi, has_alert, is_high_usage, custom_timer, runtime)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, name, type, status, power, hasWifi, hasAlert, isHighUsage, customTimer, runtime]
    );

    res.status(201).json(mapDeviceRow(result.rows[0]));
  } catch (error) {
    console.error("create device error:", error);
    res.status(500).json({ error: "failed to create device" });
  }
});

app.patch("/api/devices/:id", async (req, res) => {
  const allowedFields = {
    name: "name",
    type: "type",
    status: "status",
    power: "power",
    hasWifi: "has_wifi",
    hasAlert: "has_alert",
    isHighUsage: "is_high_usage",
    customTimer: "custom_timer",
    runtime: "runtime",
  };

  const updates = Object.entries(req.body).filter(([key]) => allowedFields[key]);
  if (updates.length === 0) {
    return res.status(400).json({ error: "no valid fields to update" });
  }

  const setClauses = updates.map(([key], index) => `${allowedFields[key]} = $${index + 1}`);
  const values = updates.map(([, value]) => value);

  try {
    const result = await pool.query(
      `UPDATE devices
       SET ${setClauses.join(", ")}, updated_at = NOW()
       WHERE id = $${values.length + 1}
       RETURNING *`,
      [...values, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "device not found" });
    }

    res.json(mapDeviceRow(result.rows[0]));
  } catch (error) {
    console.error("update device error:", error);
    res.status(500).json({ error: "failed to update device" });
  }
});

app.delete("/api/devices/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM devices WHERE id = $1", [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "device not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("delete device error:", error);
    res.status(500).json({ error: "failed to delete device" });
  }
});

const PORT = process.env.PORT || 5000;

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("database initialization failed:", error);
    process.exit(1);
  });
