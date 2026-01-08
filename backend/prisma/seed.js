import { PrismaClient } from "@prisma/client";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSQLite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API started: http://localhost:${PORT}`);
});

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  const rooms = [
    { code: "101", name: "Лекционная аудитория", capacity: 120, equipment: "projector,wifi", status: "available" },
    { code: "102", name: "Компьютерный класс", capacity: 30, equipment: "computers,projector,board,wifi", status: "booked" },
    { code: "201", name: "Конференц-зал", capacity: 50, equipment: "projector,microphone,wifi,videoconference", status: "available" },
    { code: "202", name: "Семинарская", capacity: 25, equipment: "board,wifi", status: "maintenance" },
  ];

  await prisma.room.createMany({ data: rooms });

  const bookings = [
    { roomCode: "101", roomName: "Лекционная аудитория", date: "2025-02-20", startTime: "09:00", endTime: "10:30", status: "confirmed", organizer: "Иванов И.И.", note: "Лекция по математике" },
    { roomCode: "102", roomName: "Компьютерный класс", date: "2025-02-20", startTime: "11:00", endTime: "12:30", status: "pending", organizer: "Петров П.П.", note: "Лабораторная работа" },
    { roomCode: "201", roomName: "Конференц-зал", date: "2025-02-21", startTime: "14:00", endTime: "16:00", status: "cancelled", organizer: "Сидорова А.А.", note: "Отменено по запросу" },
  ];

  await prisma.booking.createMany({ data: bookings });
}

main()
  .finally(async () => prisma.$disconnect());
