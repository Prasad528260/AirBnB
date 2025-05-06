const Home = require("../models/home");
const Booking = require("../models/Booking");
const fs = require("fs");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log(houseName, price, location, rating, description);
  console.log(req.files);

  if (!req.files || !req.files.photo) {
    return res.status(422).send("No image provided");
  }

  const photo = req.files.photo[0].path;
  const pdf = req.files.pdf ? req.files.pdf[0].path : null;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    pdf,
    description,
    owner: req.session.user._id 
  });
  home.save().then(() => {
    console.log("Home Saved successfully");
  });

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;
  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.files) {
        if (req.files.photo) {
        fs.unlink(home.photo, (err) => {
          if (err) {
              console.log("Error while deleting old photo ", err);
          }
        });
          home.photo = req.files.photo[0].path;
        }

        if (req.files.pdf) {
          if (home.pdf) {
            fs.unlink(home.pdf, (err) => {
              if (err) {
                console.log("Error while deleting old PDF ", err);
              }
            });
          }
          home.pdf = req.files.pdf[0].path;
        }
      }

      home
        .save()
        .then((result) => {
          console.log("Home updated ", result);
        })
        .catch((err) => {
          console.log("Error while updating ", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding home ", err);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};

exports.getBookedHouses = async (req, res, next) => {
  try {
    // Find all bookings for homes owned by the current host
    const hostId = req.session.user._id;
    // Find homes owned by this host
    const homes = await Home.find({ owner: hostId });
    const homeIds = homes.map(h => h._id);
    // Find bookings for these homes, populate user and home
    const bookings = await Booking.find({ home: { $in: homeIds } }).populate('user').populate('home');
    res.render("host/booked-houses", {
      bookings: bookings,
      pageTitle: "Booked Houses List",
      currentPage: "booked-houses",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (err) {
    console.log(err);
    res.render("host/booked-houses", {
      bookings: [],
      pageTitle: "Booked Houses List",
      currentPage: "booked-houses",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  }
};
