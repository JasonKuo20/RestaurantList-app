const mongoose = require("mongoose");
const Restaurant = require("../restaurant.js");
const restList = require("./restaurant.json").results;

mongoose.connect("mongodb://localhost/restaurant-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
  for (let i = 0; i < restList.length; i++) {
    Restaurant.create({
      name: restList[i].name,
      name_en: restList[i].name_en,
      category: restList[i].category,
      image: restList[i].image,
      location: restList[i].location,
      phone: restList[i].phone,
      google_map: restList[i].google_map,
      rating: restList[i].rating,
      description: restList[i].description,
    });
  }
  console.log("done");
});
