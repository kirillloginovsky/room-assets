import { useEffect, useState } from "react";
import type { Booking, BookingStatus } from "../../types/global";

interface BookingsTableProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
  onEditBooking: (booking: Booking) => void;
  onDeleteBooking: (id: string) => void;
}

export function BookingsTable({
  bookings,
  onCancelBooking,
  onEditBooking,
  onDeleteBooking,
}: BookingsTableProps) {
  const [filtered, setFiltered] = useState<Booking[]>(bookings);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    let result = bookings;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.roomCode.toLowerCase().includes(q) ||
          b.roomName.toLowerCase().includes(q) ||
          b.organizer.toLowerCase().includes(q) ||
          (b.note ?? "").toLowerCase().includes(q)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (dateFilter) {
      result = result.filter((b) => b.date === dateFilter);
    }

    setFiltered(result);
  }, [bookings, searchTerm, statusFilter, dateFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
  };

  const handleCancelClick = (id: string) => {
    if (!window.confirm("Отменить эту бронь?")) return;
    onCancelBooking(id);
  };

  const handleDeleteClick = (id: string) => {
    if (!window.confirm("Полностью удалить эту бронь?")) return;
    onDeleteBooking(id);
  };

  return (
    <div>
      {/* Панель фильтров */}
      <div className="filters-panel">
        <div className="filters-header">
          <h3 className="filters-title"> Фильтры по броням</h3>
          <button className="reset-btn" onClick={resetFilters}>
            Сбросить все
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Поиск (аудитория, организатор, примечание)</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Например, 101 или Иванов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Дата</label>
            <input
              type="date"
              className="filter-input"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Статус</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as BookingStatus | "all")
              }
            >
              <option value="all">Все статусы</option>
              <option value="confirmed">Подтверждена</option>
              <option value="pending">Ожидает подтверждения</option>
              <option value="cancelled">Отменена</option>
            </select>
          </div>
        </div>

        <div className="filter-stats">
          <div>
            <strong>Найдено броней:</strong> {filtered.length} из{" "}
            {bookings.length}
          </div>
          <div>
            <strong>Подтверждённых:</strong>{" "}
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
          <div>
            <strong>Отменённых:</strong>{" "}
            {bookings.filter((b) => b.status === "cancelled").length}
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="table-container">
        <table className="rooms-table">
          <thead>
            <tr className="table-header">
              <th>Дата</th>
              <th>Время</th>
              <th>Аудитория</th>
              <th>Организатор</th>
              <th>Статус</th>
              <th>Примечание</th>
              <th style={{ textAlign: "center" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  Брони не найдены
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr key={b.id} className="table-row">
                  <td>{b.date}</td>
                  <td>
                    {b.startTime}–{b.endTime}
                  </td>
                  <td>
                    <strong>{b.roomCode}</strong> — {b.roomName}
                  </td>
                  <td>{b.organizer}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        b.status === "confirmed"
                          ? "status-confirmed"
                          : b.status === "pending"
                          ? "status-pending"
                          : "status-cancelled"
                      }`}
                    >
                      {b.status === "confirmed" && " Подтверждена"}
                      {b.status === "pending" && "Ожидает"}
                      {b.status === "cancelled" && " Отменена"}
                    </span>
                  </td>
                  <td>{b.note || "—"}</td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        className="table-btn view-btn"
                        onClick={() =>
                          alert(
                            `Бронь ${b.id}\n${b.date} ${b.startTime}–${b.endTime}\nАудитория ${b.roomCode} (${b.roomName})\nОрганизатор: ${b.organizer}\n${b.note ?? ""}`
                          )
                        }
                      >
                        👁️
                      </button>

                      <button
                        className="table-btn edit-btn"
                        onClick={() => onEditBooking(b)}
                      >
                        ✏️
                      </button>

                      {b.status !== "cancelled" && (
                        <button
                          className="table-btn book-btn"
                          onClick={() => handleCancelClick(b.id)}
                        >
                          Отменить
                        </button>
                      )}

                      <button
                        className="table-btn delete-btn"
                        onClick={() => handleDeleteClick(b.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
