import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  // private means this property can only be accessed from inside this class
  constructor(public errors: ValidationError[]) {
    // super will call the constructor function of the base class
    super('Invalid email or password');

    // Only because we are extending a built in class with TS
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  } 
}