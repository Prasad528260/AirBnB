// External Module
const express = require("express");
const storeRouter = express.Router();

// Local Module
const storeController = require("../controllers/storeController");

storeRouter.get("/", storeController.getIndex);
storeRouter.get("/homes", storeController.getHomes);

storeRouter.get("/favourites", storeController.getFavouriteList);

storeRouter.get("/homes/:homeId", storeController.getHomeDetails);
storeRouter.get("/pdfs/:homeId", storeController.downloadPDF);
storeRouter.post("/favourites", storeController.postAddToFavourite);
storeRouter.post("/favourites/delete/:homeId", storeController.postRemoveFromFavourite);
storeRouter.post("/bookings", storeController.postAddToBooking);
storeRouter.get("/reserve/:homeId", storeController.getReserve);
storeRouter.post("/reserve/:homeId", storeController.postReserve);

storeRouter.get("/store/bookings", storeController.getBookings);


storeRouter.get('/booking', storeController.getBookings);
storeRouter.post("/booking/delete/:bookingId", storeController.postRemoveFromBooking);
module.exports = storeRouter;
