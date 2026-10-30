const { Router } = require("express");
const { getBookings } = require("../controllers/userController");
const authenticateToken = require("../middlewares/auth");
const authorizeUser = require("../middlewares/authorizeUser");
const router = Router();

router.get("/:id/bookings", authenticateToken, authorizeUser, getBookings);

module.exports = router;
