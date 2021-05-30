var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var creditRouter = require("./routes/credit");
var upcc = require("./services/upcc");
var crcc = require("./services/crcc");

var app = express();

var corsOptions = {
  origin: [
    "https://dashboard.catena.id",
    "https://api.catena.id",
    "https://catena.id",
    "http://localhost:8080",
    "https://bankA.catena.id",
    "https://bankB.catena.id",
    "https://gov.catena.id",
  ],
  methods: ["GET", "PUT", "POST", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Content-Length",
    "Accept-Encoding",
    "X-CSRF-Token",
    "Authorization",
    "accept",
    "origin",
    "Cache-Control",
    "X-Requested-With",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/credit", creditRouter);

upcc.initUpcc();
crcc.initUpcc();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

module.exports = app;
