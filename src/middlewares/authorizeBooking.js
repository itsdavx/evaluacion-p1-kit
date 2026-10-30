const { getBookingById } = require("../services/bookingService");

async function authorizeBooking(req, res, next) {
  try {
    const booking = await getBookingById(Number(req.params.id));
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    if (booking.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Access denied, not your booking" });
    }
    req.booking = booking;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authorizeBooking;
