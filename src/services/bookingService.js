const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Valida datos y que el horario esté libre
const checkSchedule = async (date, scheduleId, excludeId) => {
  if (!date || !scheduleId) {
    throw new Error("date y scheduleId son obligatorios");
  }
  const schedule = await prisma.schedule.findUnique({
    where: { id: Number(scheduleId) },
  });
  if (!schedule) {
    throw new Error("El horario no existe");
  }
  const taken = await prisma.booking.findFirst({
    where: {
      date: new Date(date),
      scheduleId: Number(scheduleId),
      // En PUT, ignora la propia reserva
      ...(excludeId && { id: { not: excludeId } }),
    },
  });
  if (taken) {
    throw new Error("El horario ya está ocupado");
  }
};

const createBooking = async (userId, date, scheduleId) => {
  await checkSchedule(date, scheduleId);
  return prisma.booking.create({
    data: {
      date: new Date(date),
      user: { connect: { id: userId } },
      schedule: { connect: { id: Number(scheduleId) } },
    },
  });
};

const getBookingById = async (id) => {
  if (Number.isNaN(id)) return null;
  return prisma.booking.findUnique({
    where: { id },
    include: { schedule: true },
  });
};

const updateBooking = async (id, date, scheduleId) => {
  await checkSchedule(date, scheduleId, id);
  return prisma.booking.update({
    where: { id },
    data: {
      date: new Date(date),
      schedule: { connect: { id: Number(scheduleId) } },
    },
  });
};

const deleteBooking = async (id) => {
  return prisma.booking.delete({ where: { id } });
};

module.exports = { createBooking, getBookingById, updateBooking, deleteBooking };
