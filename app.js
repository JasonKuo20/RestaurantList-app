// require packages used in the project
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // 載入 mongoose

mongoose.connect("mongodb://localhost/restaurant-list", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // 設定連線到 mongoDB
const db = mongoose.connection;

// require express-handlebars
const exphbs = require("express-handlebars");
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", "hbs");

db.on("error", () => {
  console.log("mongodb error!");
});

db.once("open", () => {
  console.log("mongodb connected!");
});

app.use(bodyParser.urlencoded({
  extended: true
}))

// sources form restaurant.json
const restaurantList = require("./restaurant.json");

// setting static files
app.use(express.static("public"));

// routes setting
app.get("/", (req, res) => {
  res.render("index", {
    restaurants: restaurantList.results,
  });
});

app.get("/restaurants/:restaurants_id", (req, res) => {

  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurants_id
  );
  res.render("show", {
    restaurant: restaurant,
  });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword;
  const restaurants = restaurantList.results.filter((restaurant) => {
    return (
      restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
    );
  });
  res.render("index", {
    restaurants: restaurants,
    keyword: keyword,
  });
});

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});