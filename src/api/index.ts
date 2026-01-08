export type Booking = {
  id: string;
  roomCode: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  organizer: string;
  note: string | null;
};

export type Room = {
  id: string;
  code: string;
  name: string;
  capacity: number;
  equipment: string;
  status: "available" | "booked" | "maintenance" | string;
};

export type BookingCreate = Omit<Booking, "id">;
export type BookingUpdate = Partial<BookingCreate>;

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getRooms: () => request<Room[]>("/api/rooms"),

  getBookings: () => request<Booking[]>("/api/bookings"),
  createBooking: (data: BookingCreate) =>
    request<Booking>("/api/bookings", { method: "POST", body: JSON.stringify(data) }),
  updateBooking: (id: string, data: BookingUpdate) =>
    request<Booking>(`/api/bookings/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteBooking: (id: string) =>
    request<void>(`/api/bookings/${id}`, { method: "DELETE" }),
};
