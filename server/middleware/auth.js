const { failure } = require("../utils/response");

const isLoggedIn = (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["x-csrftoken"];
  const clientAuth = {
    Authorization: !!req.headers["authorization"]
      ? `Token ${req.headers["authorization"].split(" ")[1]}`
      : "",
    "x-csrftoken": req.headers["x-csrftoken"] || ""
  };
  if (token) {
    req.clientAuth = clientAuth;
    next();
  } else {
    failure({ res, status: 401, msg: "Authorization required" });
  }
};

module.exports = {
  isLoggedIn
};
