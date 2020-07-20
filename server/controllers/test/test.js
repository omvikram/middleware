const { success, failure } = require("../../utils/response");
const { get } = require("../../utils/apiClient");
const { hotelDetail } = require("../../utils/APIURLs");

const fetchTestDetails = (req, res) => {
  get(req, testDetail(req.params.hotelCode))
    .then(data => {
      success({ res, status: 200, data });
    })
    .catch(err => {
      failure({ res, status: 500, err });
    });
};

module.exports = {
  fetchTestDetails
};
