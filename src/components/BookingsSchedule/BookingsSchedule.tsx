import type { Booking } from "../../types/global";

interface BookingsScheduleProps {
  bookings: Booking[];
}

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const getHourLabel = (h: number) => `${h.toString().padStart(2, "0")}:00`;

export function BookingsSchedule({ bookings }: BookingsScheduleProps) {
  // Берём первую дату из списка как "выбранный день"
  const currentDate =
    bookings[0]?.date ?? new Date().toISOString().slice(0, 10);
  const bookingsForDate = bookings.filter((b) => b.date === currentDate);

  // Список аудиторий, у которых есть брони в этот день
  const roomsMap = new Map<string, { code: string; name: string }>();
  for (const b of bookingsForDate) {
    roomsMap.set(b.roomCode, { code: b.roomCode, name: b.roomName });
  }
  const rooms = Array.from(roomsMap.values()).sort((a, b) =>
    a.code.localeCompare(b.code, "ru")
  );

  // Есть ли бронь для аудитории в конкретный час
  const getBookingForSlot = (roomCode: string, hour: number) =>
    bookingsForDate.find((b) => {
      if (b.roomCode !== roomCode) return false;
      const startHour = Number(b.startTime.slice(0, 2));
      const endHour = Number(b.endTime.slice(0, 2));
      return startHour <= hour && endHour > hour;
    });

  // Клик по ячейке
  const handleSlotClick = (
    roomCode: string,
    roomName: string,
    hour: number
  ) => {
    const time = getHourLabel(hour);
    const booking = getBookingForSlot(roomCode, hour);

    if (booking) {
      alert(
        [
          `Бронь аудитории ${booking.roomCode} (${booking.roomName})`,
          `${booking.date} ${booking.startTime}–${booking.endTime}`,
          `Организатор: ${booking.organizer}`,
          booking.note ? `Примечание: ${booking.note}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      );
    } else {
      alert(
        [
          "Свободный слот",
          `Аудитория: ${roomCode} (${roomName})`,
          `Дата: ${currentDate}`,
          `Время: ${time}`,
          "",
          'Можно создать бронирование через кнопку "Создать бронирование".',
        ].join("\n")
      );
    }
  };

  return (
    <div
      style={{
        marginTop: 24,
        background: "white",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 16,
        }}
      >
        <h3 style={{ fontSize: 20, color: "#2c3e50" }}>
         Сетка занятости аудиторий
        </h3>
        <span style={{ fontSize: 14, color: "#6c757d" }}>
          Дата: {currentDate}
        </span>
      </div>

      {/* Заголовок часов */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `120px repeat(${HOURS.length}, 1fr)`,
          gap: 4,
          fontSize: 12,
          color: "#6c757d",
          marginBottom: 8,
        }}
      >
        <div></div>
        {HOURS.map((h) => (
          <div key={h} style={{ textAlign: "center" }}>
            {getHourLabel(h)}
          </div>
        ))}
      </div>

      {/* Строки по аудиториям */}
      {rooms.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: "center",
            color: "#6c757d",
          }}
        >
          Для выбранной даты пока нет бронирований.
        </div>
      ) : (
        rooms.map((room) => (
          <div
            key={room.code}
            style={{
              display: "grid",
              gridTemplateColumns: `120px repeat(${HOURS.length}, 1fr)`,
              gap: 4,
              alignItems: "stretch",
              marginBottom: 6,
            }}
          >
            {/* Название аудитории слева */}
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#34495e",
              }}
            >
              {room.code}
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 400,
                  color: "#7f8c8d",
                }}
              >
                {room.name}
              </div>
            </div>

            {/* Квадратики по часам */}
            {HOURS.map((h) => {
              const booking = getBookingForSlot(room.code, h);
              const bg = booking
                ? booking.status === "confirmed"
                  ? "#2ecc71"
                  : booking.status === "pending"
                  ? "#f1c40f"
                  : "#e74c3c"
                : "#ecf0f1";

              const border = booking ? "none" : "1px dashed #dfe4ea";

              return (
                <div
                  key={h}
                  onClick={() => handleSlotClick(room.code, room.name, h)}
                  style={{
                    cursor: "pointer",
                    borderRadius: 6,
                    background: bg,
                    border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    color: booking ? "#fff" : "#95a5a6",
                    minHeight: 26,
                    transition: "transform 0.1s ease, box-shadow 0.1s ease",
                  }}
                  title={
                    booking
                      ? `${booking.roomCode} • ${booking.roomName}\n${booking.date} ${booking.startTime}–${booking.endTime}`
                      : "Свободный слот"
                  }
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      "0 0 0 2px rgba(52, 152, 219, 0.3)";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    (e.currentTarget as HTMLDivElement).style.transform =
                      "none";
                  }}
                >
                  {booking
                    ? booking.status === "confirmed"
                      ? "Занято"
                      : booking.status === "pending"
                      ? "Ожидание"
                      : "Отменено"
                    : ""}
                </div>
              );
            })}
          </div>
        ))
      )}

      {/* Легенда */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          gap: 12,
          fontSize: 12,
          color: "#6c757d",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#2ecc71",
            }}
          />
          Подтверждено
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#f1c40f",
            }}
          />
          Ожидает
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#e74c3c",
            }}
          />
          Отменено
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 4,
              background: "#ecf0f1",
              border: "1px dashed #dfe4ea",
            }}
          />
          Свободно
        </div>
      </div>
    </div>
  );
}
