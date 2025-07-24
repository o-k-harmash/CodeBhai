function AppError(message = "Internal Server Error", statusCode = 500) {
  const err = new Error(message);
  err.name = "AppError";
  err.statusCode = statusCode;

  Object.setPrototypeOf(err, AppError.prototype);
  Error.captureStackTrace(err, AppError);
  return err;
}
AppError.prototype = Object.create(Error.prototype);
AppError.prototype.constructor = AppError;

export default AppError;
