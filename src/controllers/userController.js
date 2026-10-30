const { getUserBookings } = require("../services/userService");

const getBookings = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "id inválido" });
    }
    const bookings = await getUserBookings(userId);
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getBookings };
