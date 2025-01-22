const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`); // Log the error
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
