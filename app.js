const express = require("express");
const mongoose = require("mongoose");
const httpError = require("./models/http-error");
const app = express();
const placesRoute = require("./routes/places-routes");
const userRoute = require("./routes/users-routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  next();
});

app.use("/api/places", placesRoute);

app.use("/api/users", userRoute);

app.use((req, res, next) => {
  return next(new httpError("Could not find the route"));
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Something went wrong !" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fbbfu.mongodb.net/react_places?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
    console.log("Server started successfully👍");
  })
  .catch((err) => {
    console.log(err.message);
  });
