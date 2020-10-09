// require packages used in the project
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // 載入 mongoose
// sources form restaurant.json (no db data)
// const restaurantList = require("./models/seeds/restaurant.json");
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
app.get('/', (req, res) => {
  RestaurantListDB.find()
    .lean()
    .then((restaurants) => res.render('index', {
      restaurants: restaurants
    }))
    .catch(error => {
      console.log(error)
    })
})

//新增restaurant
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
  return RestaurantListDB.create(req.body)
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log('Error from mongoose-create')
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
app.get("/search", (req, res) => {
  const keyword = req.query.keyword.trim()
  return RestaurantListDB.find()
    .lean()
    .then((restaurants) => {
      const searchRestaurants = restaurants.filter((restaurant) => restaurant.name.toLowerCase().includes(keyword) || restaurant.name_en.toLowerCase().includes(keyword))
      if (searchRestaurants.length === 0) {
        res.render('fail', {
          keyword
        })
      } else {
        res.render('index', {
          restaurants: searchRestaurants,
          keyword
        })
      }
    })
    .catch(error => {
      console.log('Error from mongoose-search')
    })
});

// 修改餐廳
app.get('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id

  return RestaurantListDB.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', {
      restaurant
    }))
    .catch(error => {
      console.log('Error from mongoose Edit' + error)
    })
})

app.post('/restaurants/:restaurant_id/edit', (req, res) => {
  const id = req.params.restaurant_id

  return RestaurantListDB.findById(id)
    .then((restaurant) => {
      restaurant = Object.assign(restaurant, req.body)
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => {
      console.log('Error from mongoose Edit Save' + error)
    })
})

// 刪除餐廳
app.post('/restaurants/:restaurant_id/delete', (req, res) => {
  const id = req.params.restaurant_id

  return RestaurantListDB.findById(id)
    .then((restaurant) => {
      restaurant.remove()
    })
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log('Error from mongoose delete' + error)
    })
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});