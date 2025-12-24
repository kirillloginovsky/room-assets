import { useEffect, useState } from "react";
import type { Room } from "../../types/global";

interface RoomTableProps {
  rooms: Room[];
  onDeleteRoom: (id: string) => void;
  onEditRoom: (room: Room) => void;
}

export function RoomTable({ rooms, onDeleteRoom, onEditRoom }: RoomTableProps) {
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [minCapacity, setMinCapacity] = useState<number>(0);
  const [equipmentFilter, setEquipmentFilter] = useState<string>("all");

  useEffect(() => {
    let result = rooms;

    if (searchTerm) {
      result = result.filter((room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((room) => room.status === statusFilter);
    }

    if (minCapacity > 0) {
      result = result.filter((room) => room.capacity >= minCapacity);
    }

    if (equipmentFilter !== "all") {
      result = result.filter((room) => room.equipment.includes(equipmentFilter));
    }

    setFilteredRooms(result);
  }, [rooms, searchTerm, statusFilter, minCapacity, equipmentFilter]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setMinCapacity(0);
    setEquipmentFilter("all");
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm("Удалить эту аудиторию?")) {
      onDeleteRoom(roomId);
    }
  };

  return (
    <div>
      {/* Панель фильтров */}
      <div className="filters-panel">
        <div className="filters-header">
          <h3 className="filters-title">🔍 Фильтры и поиск</h3>
          <button className="reset-btn" onClick={resetFilters}>
            Сбросить все
          </button>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Поиск по номеру или названию</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Введите номер или название..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Статус</label>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Все статусы</option>
              <option value="available">Доступна</option>
              <option value="booked">Забронирована</option>
              <option value="maintenance">На обслуживании</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Минимальная вместимость</label>
            <input
              type="number"
              className="filter-input"
              min="0"
              max="500"
              placeholder="0"
              value={minCapacity}
              onChange={(e) => setMinCapacity(Number(e.target.value))}
            />
          </div>

          <div className="filter-group">
            <label>Оборудование</label>
            <select
              className="filter-select"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
            >
              <option value="all">Все оборудование</option>
              <option value="projector">Проектор</option>
              <option value="wifi">Wi-Fi</option>
              <option value="computers">Компьютеры</option>
              <option value="board">Доска</option>
              <option value="microphone">Микрофон</option>
              <option value="videoconference">Видеоконференция</option>
            </select>
          </div>
        </div>

        <div className="filter-stats">
          <div>
            <strong>Найдено аудиторий:</strong> {filteredRooms.length} из{" "}
            {rooms.length}
          </div>
          <div>
            <strong>Доступных сейчас:</strong>{" "}
            {rooms.filter((r) => r.status === "available").length}
          </div>
          <div>
            <strong>Средняя вместимость:</strong>{" "}
            {rooms.length
              ? Math.round(
                  rooms.reduce((acc, r) => acc + r.capacity, 0) / rooms.length
                )
              : 0}
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="table-container">
        <table className="rooms-table">
          <thead>
            <tr className="table-header">
              <th>Номер</th>
              <th>Название</th>
              <th style={{ textAlign: "right" }}>Вместимость</th>
              <th>Оборудование</th>
              <th>Статус</th>
              <th style={{ textAlign: "center" }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="no-data">
                   Нет аудиторий, соответствующих фильтрам
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room.id} className="table-row">
                  <td
                    style={{ fontWeight: "bold", color: "#2c3e50" }}
                  >
                    {room.code}
                  </td>
                  <td>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#34495e",
                      }}
                    >
                      {room.name}
                    </div>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: "#7f8c8d",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 8,
                      }}
                    >
                      👥 <strong>{room.capacity}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="equipment-tags">
                      {room.equipment.map((item) => (
                        <span key={item} className="equipment-tag">
                          {item === "projector" && " Проектор"}
                          {item === "wifi" && "Wi-Fi"}
                          {item === "computers" && " Компьютеры"}
                          {item === "board" && " Доска"}
                          {item === "microphone" && " Микрофон"}
                          {item === "videoconference" && " Видеоконф."}
                          {item === "audio" && " Аудио"}
                          {item === "recording" && " Запись"}
                          {item === "lab equipment" && " Лаборатория"}
                          {![
                            "projector",
                            "wifi",
                            "computers",
                            "board",
                            "microphone",
                            "videoconference",
                            "audio",
                            "recording",
                            "lab equipment",
                          ].includes(item) && item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        room.status === "available"
                          ? "status-available"
                          : room.status === "booked"
                          ? "status-booked"
                          : "status-maintenance"
                      }`}
                    >
                      {room.status === "available" && " Доступна"}
                      {room.status === "booked" && " Забронирована"}
                      {room.status === "maintenance" && " На обслуживании"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-cell">
                      <button
                        className="table-btn view-btn"
                        title="Просмотр"
                        onClick={() =>
                          alert(
                            `Аудитория ${room.code}\n${room.name}\nВместимость: ${room.capacity}`
                          )
                        }
                      >
                        👁️
                      </button>
                      <button
                        className="table-btn edit-btn"
                        title="Редактировать"
                        onClick={() => onEditRoom(room)}
                      >
                        
                      </button>
                      <button
                        className="table-btn delete-btn"
                        title="Удалить"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        
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
