const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const createSchedule = async (court, startTime, endTime) => {
  if (!court || !startTime || !endTime) {
    throw new Error("court, startTime y endTime son obligatorios");
  }
  return prisma.schedule.create({
    data: {
      court,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });
};

const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      // Sin password
      user: { select: { id: true, name: true, email: true, role: true } },
      schedule: true,
    },
  });
};

module.exports = { createSchedule, getAllBookings };
