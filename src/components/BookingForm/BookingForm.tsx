import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Booking, NewBookingPayload } from "../../types/global";

interface BookingFormProps {
  mode: "create" | "edit";
  initialData?: Booking | null;
  onCancel: () => void;
  onSubmit: (payload: NewBookingPayload) => void;
}

export function BookingForm({
  mode,
  initialData,
  onCancel,
  onSubmit,
}: BookingFormProps) {
  const [form, setForm] = useState<NewBookingPayload>({
    roomCode: initialData?.roomCode ?? "",
    roomName: initialData?.roomName ?? "",
    date: initialData?.date ?? "",
    startTime: initialData?.startTime ?? "",
    endTime: initialData?.endTime ?? "",
    organizer: initialData?.organizer ?? "",
    note: initialData?.note ?? "",
  });

  const handleChange =
    (field: keyof NewBookingPayload) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.roomCode ||
      !form.date ||
      !form.startTime ||
      !form.endTime ||
      !form.organizer
    ) {
      alert("Пожалуйста, заполните все обязательные поля (*)");
      return;
    }

    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="filters-panel">
        <div className="filters-header">
          <h3 className="filters-title">
            {mode === "create" ? " Новое бронирование" : " Редактирование бронирования"}
          </h3>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Аудитория (номер)*</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Например, 101"
              value={form.roomCode}
              onChange={handleChange("roomCode")}
            />
          </div>

          <div className="filter-group">
            <label>Название аудитории</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Лекционная аудитория"
              value={form.roomName}
              onChange={handleChange("roomName")}
            />
          </div>

          <div className="filter-group">
            <label>Дата*</label>
            <input
              type="date"
              className="filter-input"
              value={form.date}
              onChange={handleChange("date")}
            />
          </div>

          <div className="filter-group">
            <label>Время начала*</label>
            <input
              type="time"
              className="filter-input"
              value={form.startTime}
              onChange={handleChange("startTime")}
            />
          </div>

          <div className="filter-group">
            <label>Время окончания*</label>
            <input
              type="time"
              className="filter-input"
              value={form.endTime}
              onChange={handleChange("endTime")}
            />
          </div>

          <div className="filter-group">
            <label>Организатор*</label>
            <input
              type="text"
              className="filter-input"
              placeholder="ФИО преподавателя / ответственного"
              value={form.organizer}
              onChange={handleChange("organizer")}
            />
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <label
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Примечание
          </label>
          <textarea
            className="filter-input"
            rows={3}
            placeholder="Дополнительная информация..."
            value={form.note}
            onChange={handleChange("note")}
          />
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancel}
          >
            Отмена
          </button>
          <button type="submit" className="primary-btn">
             {mode === "create" ? "Создать бронирование" : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </form>
  );
}
