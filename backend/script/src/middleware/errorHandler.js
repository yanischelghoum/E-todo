function errorHandler(err, req, res, next) {
  console.error(err.stack); 

  const statusCode = err.statusCode || 500;

  let message = "Internal server error";

  if (statusCode === 400) {
    message = "Bad parameter";
  } else if (statusCode === 401) {
    message = "No token, authorization denied";
  } else if (statusCode === 403) {
    message = "Token is not valid";
  } else if (statusCode === 404) {
    message = "Not found";
  }

  res.status(statusCode).json({ msg: message });
}

module.exports = errorHandler;