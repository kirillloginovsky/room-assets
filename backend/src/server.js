import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://kirillloginovsky.github.io",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // запросы без origin (curl, render healthcheck) — разрешаем
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
  })
);

app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/api/rooms", async (req, res) => {
  const rooms = await prisma.room.findMany({ orderBy: { code: "asc" } });
  res.json(rooms);
});

app.get("/api/bookings", async (req, res) => {
  const bookings = await prisma.booking.findMany({
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
  res.json(bookings);
});

// ✅ CREATE
app.post("/api/bookings", async (req, res) => {
  try {
    const { roomCode, roomName, date, startTime, endTime, status, organizer, note } = req.body ?? {};

    if (!roomCode || !date || !startTime || !endTime || !organizer) {
      return res.status(400).json({ error: "roomCode, date, startTime, endTime, organizer are required" });
    }

    const created = await prisma.booking.create({
      data: {
        roomCode: String(roomCode),
        roomName: String(roomName ?? ""),
        date: String(date),
        startTime: String(startTime),
        endTime: String(endTime),
        status: String(status ?? "pending"),
        organizer: String(organizer),
        note: note == null ? null : String(note),
      },
    });

    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ✅ UPDATE (partial)
app.patch("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const patch = req.body ?? {};
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        roomCode: patch.roomCode ?? undefined,
        roomName: patch.roomName ?? undefined,
        date: patch.date ?? undefined,
        startTime: patch.startTime ?? undefined,
        endTime: patch.endTime ?? undefined,
        status: patch.status ?? undefined,
        organizer: patch.organizer ?? undefined,
        note: patch.note === undefined ? undefined : patch.note,
      },
    });

    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// ✅ DELETE
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await prisma.booking.delete({ where: { id } });
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API started on port ${PORT}`));
