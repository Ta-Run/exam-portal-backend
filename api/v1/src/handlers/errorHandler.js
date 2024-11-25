// checkError
// eslint-disable-next-line consistent-return
exports.catchErrors = (func) => (req, res, next) => func(req, res, next).catch((error) => {
  if (typeof error === 'string') {
    return res.status(400).json({
      errorMessage: error,
    });
  }
  next(error);
});

// development errors handler middleware
exports.developmentErrorsHandler = (error, req, res) => {
  const statusCode = res.statusCode !== 200 ? 400 : res.statusCode;
  res.status(statusCode).json({
    message: error.message,
    stack: process.env.NODE_ENV === 'development' && error.stack,
  });
};

// Production Error handler middleware
exports.productionErrorsHandler = (error, req, res) => {
  res.status(error.status || 500);
  res.render('error', {
    message: error.message,
    error: {},
  });
};

// Not Found error handler
exports.notFoundErrorHandler = (req, res, next) => {
  const error = new Error('Not Found! auh');
  res.status(404);
  error.status = 404;
  next(error);
};
