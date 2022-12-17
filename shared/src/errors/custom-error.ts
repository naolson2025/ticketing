// The purpose of this CustomError is to TS with the
// statusCode & serializeErrors types.
// we use an abstract class instead of an interface because
// the interface will disapear after compilation to JS
// the abstract class will stay after compilation to JS so we can use it
// to check 'instanceof' in the error-handler.ts
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    // Only because we are extending a built in class with TS
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}