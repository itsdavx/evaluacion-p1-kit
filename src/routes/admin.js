const { Router } = require("express");
const {
  createScheduleController,
  getAllBookingsController,
} = require("../controllers/adminController");
const authenticateToken = require("../middlewares/auth");
const router = Router();

router.post("/schedules", authenticateToken, createScheduleController);
router.get("/bookings", authenticateToken, getAllBookingsController);

module.exports = router;
