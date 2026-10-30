require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Variante 5
async function main() {
  // Hijas primero
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
    },
  });

  const user = await prisma.user.create({
    data: {
      name: "Bonilla Caiza David Alejandro",
      email: "dabonilla15@espe.edu.ec",
      password: await bcrypt.hash("user123", 10),
      role: "USER",
    },
  });

  const padel = await prisma.schedule.create({
    data: {
      court: "Pádel 2",
      startTime: new Date("2026-11-17T08:00:00Z"),
      endTime: new Date("2026-11-17T10:00:00Z"),
    },
  });

  const voley = await prisma.schedule.create({
    data: {
      court: "Vóley 3",
      startTime: new Date("2026-11-17T10:00:00Z"),
      endTime: new Date("2026-11-17T12:00:00Z"),
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-17"),
      user: { connect: { id: user.id } },
      schedule: { connect: { id: padel.id } },
    },
  });

  await prisma.booking.create({
    data: {
      date: new Date("2026-11-17"),
      user: { connect: { id: admin.id } },
      schedule: { connect: { id: voley.id } },
    },
  });

  console.log("Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
