import AppError from "./appError.js";

function BadRequestError(message = "Bad Request") {
  const err = new AppError(message, 400);
  err.name = "BadRequestError";
  Object.setPrototypeOf(err, BadRequestError.prototype);
  return err;
}
BadRequestError.prototype = Object.create(AppError.prototype);
BadRequestError.prototype.constructor = BadRequestError;

export default BadRequestError;
