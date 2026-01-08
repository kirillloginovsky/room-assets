require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // важно
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  await prisma.room.createMany({
    data: [
      { code: "101", name: "Лекционная аудитория", capacity: 120, equipment: "projector,wifi", status: "available" },
      { code: "102", name: "Компьютерный класс", capacity: 30, equipment: "computers,projector,board,wifi", status: "booked" },
      { code: "201", name: "Конференц-зал", capacity: 50, equipment: "projector,microphone,wifi,videoconference", status: "available" },
      { code: "202", name: "Семинарская", capacity: 25, equipment: "board,wifi", status: "maintenance" },
    ],
  });

  await prisma.booking.createMany({
    data: [
      { roomCode: "101", roomName: "Лекционная аудитория", date: "2025-02-20", startTime: "09:00", endTime: "10:30", status: "confirmed", organizer: "Иванов И.И.", note: "Лекция по математике" },
      { roomCode: "102", roomName: "Компьютерный класс", date: "2025-02-20", startTime: "11:00", endTime: "12:30", status: "pending", organizer: "Петров П.П.", note: "Лабораторная работа" },
      { roomCode: "201", roomName: "Конференц-зал", date: "2025-02-21", startTime: "14:00", endTime: "16:00", status: "cancelled", organizer: "Сидорова А.А.", note: "Отменено по запросу" },
    ],
  });

  console.log("Seed done");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
