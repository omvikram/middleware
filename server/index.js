const { app } = require("./app");
const cors = require("cors");
const compression = require("compression");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");
const helmet = require("helmet");
const uuidv1 = require("uuid/v1");

const { isLoggedIn } = require("./middleware/auth");
const { authRoutes } = require("./routes/authRoutes");
const { publicRoutes } = require("./routes/publicRoutes");
const { failure } = require("./utils/response");

const { ENV_VARS } = require("./app");

const port = ENV_VARS.__PORT__;

const logDirectory = path.resolve("./middleware-logs");

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
var accessLogStream = rfs("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory
});

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/middleware/healthcheck", (req, res) => {
  try {
    res.send({
      uptime: Math.round(process.uptime()),
      message: "OK",
      timestamp: new Date()
    });
  } catch (e) {
    res.status(503).end();
  }
});

app.use((req, res, next) => {
  req.id = uuidv1();
  next();
});

morgan.token("id", req => {
  return req.id;
});

const logPattern = `:id :date[iso] :http-version :method :url :referrer :remote-addr :req[header] :res[header] :response-time :status :user-agent`;

app.use(morgan(logPattern, { stream: accessLogStream }));
app.use(cors());

app.use(compression());

// public APIs
app.use("/middleware/public", publicRoutes);

// auth APIs
app.use("/middleware", isLoggedIn, authRoutes);

// return response for unknown URL request
app.use("*", (req, res) => {
  failure({ res, status: 404, msg: "Path Not Found" });
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
