import AppError from "./appError.js";

function NotFoundError(message = "Not Found") {
  const err = new AppError(message, 404);
  err.name = "NotFoundError";
  Object.setPrototypeOf(err, NotFoundError.prototype);
  return err;
}
NotFoundError.prototype = Object.create(AppError.prototype);
NotFoundError.prototype.constructor = NotFoundError;

export default NotFoundError;
