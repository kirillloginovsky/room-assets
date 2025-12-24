import { http, HttpResponse } from "msw";
import type {
  Booking,
  NewBookingPayload,
  Room,
  RoomFormPayload,
} from "../types/global";

let rooms: Room[] = [
  {
    id: "1",
    code: "101",
    name: "Лекционная аудитория",
    capacity: 120,
    equipment: ["projector", "wifi"],
    status: "available",
  },
  {
    id: "2",
    code: "102",
    name: "Компьютерный класс",
    capacity: 30,
    equipment: ["computers", "projector", "board", "wifi"],
    status: "booked",
  },
  {
    id: "3",
    code: "201",
    name: "Конференц-зал",
    capacity: 50,
    equipment: ["projector", "microphone", "wifi", "videoconference"],
    status: "available",
  },
  {
    id: "4",
    code: "202",
    name: "Семинарская",
    capacity: 25,
    equipment: ["board", "wifi"],
    status: "maintenance",
  },
];

let bookings: Booking[] = [
  {
    id: "b1",
    roomCode: "101",
    roomName: "Лекционная аудитория",
    date: "2025-02-20",
    startTime: "09:00",
    endTime: "10:30",
    status: "confirmed",
    organizer: "Иванов И.И.",
    note: "Лекция по математике",
  },
  {
    id: "b2",
    roomCode: "102",
    roomName: "Компьютерный класс",
    date: "2025-02-20",
    startTime: "11:00",
    endTime: "12:30",
    status: "pending",
    organizer: "Петров П.П.",
    note: "Лабораторная работа",
  },
  {
    id: "b3",
    roomCode: "201",
    roomName: "Конференц-зал",
    date: "2025-02-21",
    startTime: "14:00",
    endTime: "16:00",
    status: "cancelled",
    organizer: "Сидорова А.А.",
    note: "Отменено по запросу",
  },
];

export const handlers = [
  // =========================
  // ROOMS
  // =========================
  http.get("/api/rooms", () => {
    return HttpResponse.json(rooms);
  }),

  http.post("/api/rooms", async ({ request }) => {
    const payload = (await request.json()) as RoomFormPayload;

    const newRoom: Room = {
      id: String(Date.now()),
      code: payload.code,
      name: payload.name,
      capacity: payload.capacity,
      equipment: payload.equipment
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status: payload.status,
    };

    rooms = [...rooms, newRoom];
    return HttpResponse.json(newRoom, { status: 201 });
  }),

  http.put("/api/rooms/:id", async ({ params, request }) => {
    const { id } = params as { id: string };
    const payload = (await request.json()) as RoomFormPayload;

    rooms = rooms.map((r) =>
      r.id === id
        ? {
            ...r,
            code: payload.code,
            name: payload.name,
            capacity: payload.capacity,
            equipment: payload.equipment
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            status: payload.status,
          }
        : r
    );

    const updated = rooms.find((r) => r.id === id);
    if (!updated) {
      return HttpResponse.json({ message: "Room not found" }, { status: 404 });
    }
    return HttpResponse.json(updated);
  }),

  http.delete("/api/rooms/:id", ({ params }) => {
    const { id } = params as { id: string };
    rooms = rooms.filter((r) => r.id !== id);
    return HttpResponse.json({ ok: true });
  }),

  // =========================
  // BOOKINGS
  // =========================
  http.get("/api/bookings", () => {
    return HttpResponse.json(bookings);
  }),

  http.post("/api/bookings", async ({ request }) => {
    const payload = (await request.json()) as NewBookingPayload;

    const newBooking: Booking = {
      id: String(Date.now()),
      roomCode: payload.roomCode,
      roomName: payload.roomName || "Без названия",
      date: payload.date,
      startTime: payload.startTime,
      endTime: payload.endTime,
      status: "confirmed",
      organizer: payload.organizer,
      note: payload.note,
    };

    bookings = [...bookings, newBooking];
    return HttpResponse.json(newBooking, { status: 201 });
  }),

  http.put("/api/bookings/:id", async ({ params, request }) => {
    const { id } = params as { id: string };
    const payload = (await request.json()) as NewBookingPayload;

    bookings = bookings.map((b) =>
      b.id === id
        ? {
            ...b,
            roomCode: payload.roomCode,
            roomName: payload.roomName || b.roomName,
            date: payload.date,
            startTime: payload.startTime,
            endTime: payload.endTime,
            organizer: payload.organizer,
            note: payload.note,
          }
        : b
    );

    const updated = bookings.find((b) => b.id === id);
    if (!updated) {
      return HttpResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(updated);
  }),

  // Отмена брони отдельным методом (PATCH)
  http.patch("/api/bookings/:id/cancel", ({ params }) => {
    const { id } = params as { id: string };

    bookings = bookings.map((b) =>
      b.id === id
        ? {
            ...b,
            status: "cancelled",
            note: (b.note ?? "") + " (отменено)",
          }
        : b
    );

    const updated = bookings.find((b) => b.id === id);
    if (!updated) {
      return HttpResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }
    return HttpResponse.json(updated);
  }),

  http.delete("/api/bookings/:id", ({ params }) => {
    const { id } = params as { id: string };
    bookings = bookings.filter((b) => b.id !== id);
    return HttpResponse.json({ ok: true });
  }),
];
