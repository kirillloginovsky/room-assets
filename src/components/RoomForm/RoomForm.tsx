import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Room, RoomFormPayload, RoomStatus } from "../../types/global";

interface RoomFormProps {
  mode: "create" | "edit";
  initialRoom: Room | null;
  onCancel: () => void;
  onSave: (payload: RoomFormPayload) => void;
}

export function RoomForm({ mode, initialRoom, onCancel, onSave }: RoomFormProps) {
  const [form, setForm] = useState<RoomFormPayload>({
    code: initialRoom?.code ?? "",
    name: initialRoom?.name ?? "",
    capacity: initialRoom?.capacity ?? 0,
   equipment: initialRoom ? String(initialRoom.equipment ?? "") : "",
    status: initialRoom?.status ?? "available",
  });

  const handleChange =
    (field: keyof RoomFormPayload) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;

      if (field === "capacity") {
        const num = Number(value);
        setForm((prev) => ({ ...prev, capacity: isNaN(num) ? 0 : num }));
      } else if (field === "status") {
        setForm((prev) => ({ ...prev, status: value as RoomStatus }));
      } else {
        setForm((prev) => ({ ...prev, [field]: value }));
      }
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.code || !form.name || !form.capacity) {
      alert("Пожалуйста, заполните номер, название и вместимость.");
      return;
    }

    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="filters-panel">
        <div className="filters-header">
          <h3 className="filters-title">
            {mode === "create" ? "Новая аудитория" : " Редактирование аудитории"}
          </h3>
        </div>

        <div className="filters-grid">
          <div className="filter-group">
            <label>Номер аудитории*</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Например, 101"
              value={form.code}
              onChange={handleChange("code")}
            />
          </div>

          <div className="filter-group">
            <label>Название*</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Лекционная аудитория"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>

          <div className="filter-group">
            <label>Вместимость*</label>
            <input
              type="number"
              className="filter-input"
              min={1}
              max={500}
              value={form.capacity}
              onChange={handleChange("capacity")}
            />
          </div>

          <div className="filter-group">
            <label>Статус</label>
            <select
              className="filter-select"
              value={form.status}
              onChange={handleChange("status")}
            >
              <option value="available">Доступна</option>
              <option value="booked">Забронирована</option>
              <option value="maintenance">На обслуживании</option>
            </select>
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
            Оборудование (через запятую)
          </label>
          <input
            type="text"
            className="filter-input"
            placeholder="projector, wifi, computers"
            value={form.equipment}
            onChange={handleChange("equipment")}
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
             {mode === "create" ? "Добавить аудиторию" : "Сохранить изменения"}
          </button>
        </div>
      </div>
    </form>
  );
}
