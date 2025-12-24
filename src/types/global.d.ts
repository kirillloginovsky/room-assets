// Типы для навигации
export interface NavItem {
  id: string;
  label: string;
  icon?: string;
}

// Тип пользователя
export interface User {
  name: string;
  avatar?: string;
}

// --- НОВОЕ: тип брони ---
export type BookingStatus = "confirmed" | "pending" | "cancelled";

export interface Booking {
  id: string;
  roomCode: string;
  roomName: string;
  date: string;      // '2025-02-20'
  startTime: string; // '09:00'
  endTime: string;   // '10:30'
  status: BookingStatus;
  organizer: string;
  note?: string;
}
export interface NewBookingPayload {
  roomCode: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  organizer: string;
  note?: string;
}
export type RoomStatus = "available" | "booked" | "maintenance";

export interface Room {
  id: string;
  code: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: RoomStatus;
}

export interface RoomFormPayload {
  code: string;
  name: string;
  capacity: number;
  equipment: string; // строка через запятую
  status: RoomStatus;
}
