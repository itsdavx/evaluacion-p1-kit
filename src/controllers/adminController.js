const { createSchedule, getAllBookings } = require("../services/adminService");

const createScheduleController = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied, admin only" });
  }
  try {
    const { court, startTime, endTime } = req.body;
    const schedule = await createSchedule(court, startTime, endTime);
    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllBookingsController = async (req, res) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Access denied, admin only" });
  }
  try {
    const bookings = await getAllBookings();
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createScheduleController, getAllBookingsController };
