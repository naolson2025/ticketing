import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// add a new property to the Request interface
// this adds/modifies an existing interface
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// The purpose of this middleware is to check if the user is logged in
// so any route that needs to check if the user is logged in can use this middleware
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if the user is not logged in, the req.session.jwt will be undefined
  // and we will call next() to move on to the next middleware
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // first argument is the token
    // second argument is the secret key (set up in env variables)
    // try to verify the JWT, if it fails throw an error
    // the ! here means that we are telling TS that we are sure that the JWT_KEY is defined
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;
    // the payload will be the user id and email
    /**
      "currentUser": {
        "id": "6386807b522358aff3baab28",
        "email": "test@test.com",
        "iat": 1669759230
      }
    */
    req.currentUser = payload;
  } catch (error) {}
  // continue on to the next middleware
  next();
};
