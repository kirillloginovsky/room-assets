import { useEffect, useState, type ChangeEvent } from "react";
import { Header } from "./components/Header";
import { Button } from "./components/Button";
import { RoomTable } from "./components/RoomTable";
import { BookingsTable } from "./components/BookingsTable";
import { BookingForm } from "./components/BookingForm";
import { BookingsSchedule } from "./components/BookingsSchedule";
import { RoomForm } from "./components/RoomForm";

import * as RoomsApi from "./api/rooms";
import * as BookingsApi from "./api/bookings";

import type {
  Booking,
  NewBookingPayload,
  Room,
  RoomFormPayload,
} from "./types/global";

import "./App.css";

interface ExportData {
  rooms: Room[];
  bookings: Booking[];
}

function App() {
  const [activeNav, setActiveNav] = useState("catalog");

  // загрузка
  const [loading, setLoading] = useState(true);

  // данные
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Бронирования UI
  const [bookingMode, setBookingMode] = useState<"list" | "create" | "edit">(
    "list"
  );
  const [bookingsView, setBookingsView] = useState<"table" | "schedule">(
    "table"
  );
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  // Аудитории UI
  const [roomMode, setRoomMode] = useState<"list" | "create" | "edit">("list");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // ====== ЗАГРУЗКА ИЗ API (MSW) ======
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [r, b] = await Promise.all([
          RoomsApi.getRooms(),
          BookingsApi.getBookings(),
        ]);
        setRooms(r);
        setBookings(b);
      } catch (e) {
        console.error(e);
        alert("Ошибка загрузки данных из API (MSW). Проверь консоль.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleNavigate = (id: string) => {
    setActiveNav(id);

    if (id === "bookings") {
      setBookingMode("list");
      setBookingsView("table");
      setEditingBooking(null);
    }

    if (id === "catalog") {
      setRoomMode("list");
      setEditingRoom(null);
    }
  };

  // ====== EXPORT ======
  const handleExportData = () => {
    const data: ExportData = { rooms, bookings };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `room-booking-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ====== IMPORT (только в состояние фронта) ======
  const handleImportData = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text) as Partial<ExportData>;

        if (
          !parsed ||
          typeof parsed !== "object" ||
          !Array.isArray(parsed.rooms) ||
          !Array.isArray(parsed.bookings)
        ) {
          alert("Файл имеет неверный формат. Ожидаются поля rooms и bookings.");
          return;
        }

        setRooms(parsed.rooms as Room[]);
        setBookings(parsed.bookings as Booking[]);
        alert("Данные успешно импортированы из файла.");
      } catch (error) {
        console.error(error);
        alert("Ошибка при чтении или разборе JSON-файла.");
      } finally {
        event.target.value = "";
      }
    };

    reader.readAsText(file, "utf-8");
  };

  // ====== BOOKINGS CRUD через API ======
  const handleCreateBooking = async (data: NewBookingPayload) => {
    try {
      const created = await BookingsApi.createBooking(data);
      setBookings((prev) => [...prev, created]);
      setBookingMode("list");
      setBookingsView("table");
    } catch (e) {
      console.error(e);
      alert("Ошибка создания бронирования.");
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const updated = await BookingsApi.cancelBooking(id);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (e) {
      console.error(e);
      alert("Ошибка отмены бронирования.");
    }
  };

  const handleUpdateBooking = async (id: string, data: NewBookingPayload) => {
    try {
      const updated = await BookingsApi.updateBooking(id, data);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      setBookingMode("list");
      setEditingBooking(null);
    } catch (e) {
      console.error(e);
      alert("Ошибка обновления бронирования.");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await BookingsApi.deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e) {
      console.error(e);
      alert("Ошибка удаления бронирования.");
    }
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setBookingMode("edit");
  };

  // ====== ROOMS CRUD через API ======
  const handleCreateRoom = async (data: RoomFormPayload) => {
    try {
      const created = await RoomsApi.createRoom(data);
      setRooms((prev) => [...prev, created]);
      setRoomMode("list");
    } catch (e) {
      console.error(e);
      alert("Ошибка создания аудитории.");
    }
  };

  const handleUpdateRoom = async (id: string, data: RoomFormPayload) => {
    try {
      const updated = await RoomsApi.updateRoom(id, data);
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setRoomMode("list");
      setEditingRoom(null);
    } catch (e) {
      console.error(e);
      alert("Ошибка обновления аудитории.");
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      await RoomsApi.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      console.error(e);
      alert("Ошибка удаления аудитории.");
    }
  };

  const handleEditRoom = (room: Room) => {
    setEditingRoom(room);
    setRoomMode("edit");
  };

  if (loading) {
    return (
      <div className="app-container">
        <Header
          activeNavId={activeNav}
          onNavigate={handleNavigate}
          onBellClick={() => alert("🔔 Уведомления")}
          userName="Мария Петрова"
        />
        <main className="main-content">
          <div className="no-data" style={{ background: "white" }}>
            Загрузка данных...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header
        activeNavId={activeNav}
        onNavigate={handleNavigate}
        onBellClick={() => alert("🔔 Уведомления")}
        userName="Мария Петрова"
      />

      <main className="main-content">
        <h1 className="page-title"> Добро пожаловать в Room Booking!</h1>
        <p className="page-subtitle">
          Система бронирования аудиторий и оборудования
        </p>

        {/* Импорт / Экспорт */}
        <div className="data-actions">
          <Button variant="secondary" onClick={handleExportData}>
             Экспорт данных (JSON)
          </Button>

          <label className="secondary-btn file-input-label">
            Импорт данных (JSON)
            <input
              type="file"
              accept="application/json"
              onChange={handleImportData}
            />
          </label>
        </div>

        <div className="action-buttons">
          <Button
            onClick={() => {
              setActiveNav("bookings");
              setBookingMode("create");
              setEditingBooking(null);
            }}
          >
            Создать бронирование
          </Button>

          <Button
            variant="secondary"
            onClick={() => {
              setActiveNav("catalog");
              setRoomMode("list");
            }}
          >
           Поиск аудиторий
          </Button>
        </div>

        {/* Статистика (можно позже связать с данными) */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{rooms.length}</div>
            <div className="stat-label">Всего аудиторий</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {rooms.filter((r) => r.status === "available").length}
            </div>
            <div className="stat-label">Доступные сейчас</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {bookings.filter((b) => b.status !== "cancelled").length}
            </div>
            <div className="stat-label">Бронирования</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">156</div>
            <div className="stat-label">Единиц оборудования</div>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          {/* Каталог аудиторий */}
          {activeNav === "catalog" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  color: "#2c3e50",
                  marginBottom: "16px",
                }}
              >
                Каталог аудиторий
              </h2>

              {roomMode === "list" ? (
                <>
                  <div className="view-toggle" style={{ marginBottom: 16 }}>
                    <button
                      type="button"
                      className="primary-btn"
                      onClick={() => {
                        setRoomMode("create");
                        setEditingRoom(null);
                      }}
                    >
                    Добавить аудиторию
                    </button>
                  </div>

                  <RoomTable
                    rooms={rooms}
                    onDeleteRoom={handleDeleteRoom}
                    onEditRoom={handleEditRoom}
                  />
                </>
              ) : (
                <RoomForm
                  mode={roomMode === "create" ? "create" : "edit"}
                  initialRoom={roomMode === "edit" ? editingRoom : null}
                  onCancel={() => {
                    setRoomMode("list");
                    setEditingRoom(null);
                  }}
                  onSave={(payload) => {
                    if (roomMode === "create") {
                      void handleCreateRoom(payload);
                    } else if (roomMode === "edit" && editingRoom) {
                      void handleUpdateRoom(editingRoom.id, payload);
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* Управление бронированием */}
          {activeNav === "bookings" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  color: "#2c3e50",
                  marginBottom: "16px",
                }}
              >
              Управление бронированием
              </h2>

              {bookingMode === "list" ? (
                <>
                  <div className="view-toggle">
                    <button
                      type="button"
                      className={
                        bookingsView === "table"
                          ? "primary-btn"
                          : "secondary-btn"
                      }
                      onClick={() => setBookingsView("table")}
                    >
                    Список
                    </button>
                    <button
                      type="button"
                      className={
                        bookingsView === "schedule"
                          ? "primary-btn"
                          : "secondary-btn"
                      }
                      onClick={() => setBookingsView("schedule")}
                    >
                      Расписание
                    </button>
                  </div>

                  {bookingsView === "table" ? (
                    <>
                      <div
                        className="no-data"
                        style={{
                          background: "white",
                          padding: "24px",
                          marginBottom: "24px",
                        }}
                      >
                        Здесь отображаются все бронирования.
                        <br />
                        Нажмите «Создать бронирование» вверху страницы, чтобы
                        добавить новую запись.
                      </div>

                      <BookingsTable
                        bookings={bookings}
                        onCancelBooking={handleCancelBooking}
                        onEditBooking={handleEditBooking}
                        onDeleteBooking={handleDeleteBooking}
                      />
                    </>
                  ) : (
                    <BookingsSchedule bookings={bookings} />
                  )}
                </>
              ) : (
                <BookingForm
                  mode={bookingMode}
                  initialData={bookingMode === "edit" ? editingBooking : null}
                  onCancel={() => {
                    setBookingMode("list");
                    setEditingBooking(null);
                  }}
                  onSubmit={(payload) => {
                    if (bookingMode === "create") {
                      void handleCreateBooking(payload);
                    } else if (bookingMode === "edit" && editingBooking) {
                      void handleUpdateBooking(editingBooking.id, payload);
                    }
                  }}
                />
              )}
            </div>
          )}

          {/* Настройки */}
          {activeNav === "settings" && (
            <div>
              <h2
                style={{
                  fontSize: "24px",
                  color: "#2c3e50",
                  marginBottom: "16px",
                }}
              >
                Настройки
              </h2>
              <div
                className="no-data"
                style={{ background: "white", padding: "40px" }}
              >
                Раздел в разработке. Здесь будут настройки приложения.
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
