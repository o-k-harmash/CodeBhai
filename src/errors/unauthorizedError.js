import AppError from "./appError.js";

function UnauthorizedError(message = "Unauthorized") {
  const err = new AppError(message, 401);
  err.name = "UnauthorizedError";
  Object.setPrototypeOf(err, UnauthorizedError.prototype);
  return err;
}
UnauthorizedError.prototype = Object.create(AppError.prototype);
UnauthorizedError.prototype.constructor = UnauthorizedError;

export default UnauthorizedError;
