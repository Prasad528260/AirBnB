const Home = require("../models/home");
const User = require("../models/user");
const Booking = require("../models/Booking");

exports.getIndex = (req, res, next) => {
  console.log("Session Value: ", req.session);
  Home.find().then((registeredHomes) => {
    res.render("store/index", {
      registeredHomes: registeredHomes,
      pageTitle: "airbnb Home",
      currentPage: "index",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("store/home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Homes List",
      currentPage: "Home",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  });
};

exports.getBookings = async (req, res, next) => {
  try {
    if (!req.session.user) {
      return res.redirect('/login');
    }
    const userId = req.session.user._id;
    const bookings = await Booking.find({ user: userId }).populate('home');
    res.render("store/bookings", {
      bookings: bookings,
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.render("store/bookings", {
      bookings: [],
      pageTitle: "My Bookings",
      currentPage: "bookings",
      isLoggedIn: req.isLoggedIn, 
      user: req.session.user,
    });
  }
};

exports.getFavouriteList = async (req, res, next) => {
  const userId = req.session.user._id;
  const user = await User.findById(userId).populate('favourites');
  res.render("store/favourite-list", {
    favouriteHomes: user.favourites,
    pageTitle: "My Favourites",
    currentPage: "favourites",
    isLoggedIn: req.isLoggedIn, 
    user: req.session.user,
  });
};

exports.postAddToFavourite = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (!user.favourites.includes(homeId)) {
    user.favourites.push(homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.postRemoveFromFavourite = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user.favourites.includes(homeId)) {
    user.favourites = user.favourites.filter(fav => fav != homeId);
    await user.save();
  }
  res.redirect("/favourites");
};

exports.getHomeDetails = (req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found");
      res.redirect("/homes");
    } else {
      res.render("store/home-detail", {
        home: home,
        pageTitle: "Home Detail",
        currentPage: "Home",
        isLoggedIn: req.isLoggedIn, 
        user: req.session.user,
      });
    }
  });
};

exports.downloadPDF = [(req,res,next)=>{
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
},(req, res, next) => {
  const homeId = req.params.homeId;
  Home.findById(homeId)
    .then(home => {
      if (!home || !home.pdf) {
        return res.status(404).send('PDF not found');
      }
      const filePath = home.pdf;
      const fileName = `rules_${home.houseName}.pdf`;
      
      res.download(filePath, fileName, (err) => {
        if (err) {
          console.log('Error downloading file:', err);
          res.status(500).send('Error downloading file');
        }
      });
    })
    .catch(err => {
      console.log('Error finding home:', err);
      res.status(500).send('Error processing request');
    });
}];

exports.postAddToBooking = async (req, res, next) => {
  const homeId = req.body.id;
  const userId = req.session.user._id;
  const { checkIn, checkOut } = req.body;
  const overlap = await Booking.findOne({
    home: homeId,
    $or: [
      { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
    ]
  });
  if (overlap) {
    return res.redirect("/booking?error=Home already booked for selected dates");
  }
  const booking = new Booking({
    home: homeId,
    user: userId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut)
  });
  await booking.save();
  res.redirect("/booking");
};

exports.postRemoveFromBooking = async (req, res, next) => {
  const bookingId = req.params.bookingId;
  await Booking.findByIdAndDelete(bookingId);
  res.redirect("/booking");
};

exports.getReserve = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const existing = await Booking.findOne({ home: homeId, user: userId });
  if (existing) {
    return res.redirect("/booking?error=Already booked this home");
  }
  const home = await Home.findById(homeId);
  if (!home) {
    return res.redirect("/homes");
  }
  res.render("store/reserve",  {
    pageTitle: "Reserve",
    currentPage: "reserve",
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
    home: home,
    days: 1,
    totalPrice: home.price,
    checkIn: '',
    checkOut: ''
  });
};

exports.postReserve = async (req, res, next) => {
  const homeId = req.params.homeId;
  const userId = req.session.user._id;
  const { checkIn, checkOut } = req.body;
  const overlap = await Booking.findOne({
    home: homeId,
    $or: [
      { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
    ]
  });
  if (overlap) {
    return res.redirect("/booking?error=Home already booked for selected dates");
  }
  const booking = new Booking({
    home: homeId,
    user: userId,
    checkIn: new Date(checkIn),
    checkOut: new Date(checkOut)
  });
  await booking.save();
  res.redirect("/booking");
};
