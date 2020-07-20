const express = require("express");
const app = express();
const ENV_VARS = require(`./envs/${process.env.NODE_ENV}`);

module.exports = {
  app,
  express,
  ENV_VARS
};
