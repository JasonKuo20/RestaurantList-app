// require packages used in the project
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // 載入 mongoose
// sources form restaurant.json (no db data)
const restaurantList = require("./models/seeds/restaurant.json");
// sources from db
const RestaurantListDB = require("./models/restaurant")

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

// setting static files
app.use(express.static("public"));

// routes setting
// app.get("/", (req, res) => {
//   res.render("index", {
//     restaurants: restaurantList.results,
//   });
// });

app.get('/', (req, res) => {
  RestaurantListDB.find()
    .lean()
    .then((restaurants) => res.render('index', {
      restaurants: restaurants
    }))
    .catch(error => {
      console.log('Error from mongoose-index')
    })
})



// open restaurant detail page
app.get("/restaurants/:restaurants_id", (req, res) => {
  const id = req.params.restaurants_id
  return RestaurantListDB.findById(id)
    .lean()
    .then((restaurant) => res.render('show', {
      restaurant,
      id
    }))
    .catch(error => console.log(error))
});

// Search Restaurant
// app.get("/search", (req, res) => {
//   const keyword = req.query.keyword;
//   const restaurants = restaurantList.results.filter((restaurant) => {
//     return (
//       restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
//       restaurant.category.toLowerCase().includes(keyword.toLowerCase())
//     );
//   });
//   res.render("index", {
//     restaurants: restaurants,
//     keyword: keyword,
//   });
// });

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});