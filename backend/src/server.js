import express from "express";
import cors from "cors";
import { prisma } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/api/rooms", async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

app.get("/api/bookings", async (req, res) => {
  const bookings = await prisma.booking.findMany({
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
  res.json(bookings);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API started on port ${PORT}`);
});
