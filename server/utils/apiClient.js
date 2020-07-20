const axios = require("axios");
const { ENV_VARS } = require("../app");
const axiosRetry = require("axios-retry");

const baseURL = ENV_VARS.__INVENTORY_HOST__;

const generateHeaders = req => {
  return {
    ...req.clientAuth,
    id: req.id,
    agent: "middleware"
  };
};

const inventoryClient = axios.create({
  baseURL: baseURL,
  timeout: 10000
});

axiosRetry(inventoryClient, { retries: 2 });

const get = (req, url, data = {}) => {
  return new Promise((resolve, reject) => {
    inventoryClient
      .get(url, {
        params: data,
        headers: generateHeaders(req)
      })
      .then(data => {
        if (data.data.data) {
          resolve(data.data.data);
        } else {
          resolve(data.data);
        }
      })
      .catch(err => {
        reject(err);
      });
  });
};

const post = (token, url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios
      .post(url, data)
      .then(data => {
        resolve(data.data.data);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  get,
  post
};
