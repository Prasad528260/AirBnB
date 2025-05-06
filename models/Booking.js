const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  home: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true }
});

module.exports = mongoose.model("Booking", bookingSchema);