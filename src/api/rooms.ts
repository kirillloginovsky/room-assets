import type { Room, RoomFormPayload } from "../types/global";
import { api } from "./http";

export function getRooms() {
  return api<Room[]>("/api/rooms");
}

export function createRoom(payload: RoomFormPayload) {
  return api<Room>("/api/rooms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateRoom(id: string, payload: RoomFormPayload) {
  return api<Room>(`/api/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteRoom(id: string) {
  return api<{ ok: boolean }>(`/api/rooms/${id}`, { method: "DELETE" });
}
