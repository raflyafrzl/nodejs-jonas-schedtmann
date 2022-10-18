const AppError = require('../utils/app-error');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message
    });

    //programming or other unknown error: don't leak error details to client.
  } else {
    //1) log the error

    console.error('ERROR', err);
    //2) send generic message
    res.status(500).send({
      status: 'error',
      message: 'something went very wrong!'
    });
  }
};
const handleDuplicateFieldsDB = err => {
  const { name } = err.keyValue;
  const message = `Duplicate field value: ${name}`;
  console.log(message);
  return new AppError(message, 400);
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

function errMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    //handle invalid ID
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    //handle Duplicate Fields
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(error, res);
  } else if (process.env.NODE_ENV === 'DEVELOPMENT') {
    sendErrorDev(err, res);
  }
}

module.exports = errMiddleware;
