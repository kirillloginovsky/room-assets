import type { Booking, NewBookingPayload } from "../types/global";
import { api } from "./http";

export function getBookings() {
  return api<Booking[]>("/api/bookings");
}

export function createBooking(payload: NewBookingPayload) {
  return api<Booking>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBooking(id: string, payload: NewBookingPayload) {
  return api<Booking>(`/api/bookings/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function cancelBooking(id: string) {
  return api<Booking>(`/api/bookings/${id}/cancel`, { method: "PATCH" });
}

export function deleteBooking(id: string) {
  return api<{ ok: boolean }>(`/api/bookings/${id}`, { method: "DELETE" });
}
