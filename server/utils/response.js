const success = ({ res, status = 200, data = {}, msg = "success" }) => {
  return res.status(status).json({
    data,
    msg,
    status
  });
};

const failure = ({
  res,
  status = 500,
  err = {},
  msg = "something went wrong"
}) => {
  return res.status(status).json({
    data: err,
    msg,
    status
  });
};

module.exports = {
  success,
  failure
};
