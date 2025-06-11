const successResponse = (data = null, message = "Success") => {
  return {
    status: "success",
    message,
    data,
  };
};

const errorResponse = (message = "Error", statusCode = 500) => {
  return {
    status: "error",
    message,
    statusCode,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
