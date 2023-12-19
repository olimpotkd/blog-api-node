const globalErrorHandler = (err, req, res, next) => {
  const { stack, message } = err;
  const status = err.status ? err.status : "failed";
  const statusCode = err.statusCode ? err.statusCode : 500;

  res.status(statusCode).json({ message, stack, status });
};

module.exports = globalErrorHandler;
