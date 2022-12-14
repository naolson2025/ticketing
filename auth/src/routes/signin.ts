import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@nao2025tickets/common';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
      // this is the secret key that will be used to verify the JWT
      // the ! here means that we are telling TS that we are sure that the JWT_KEY is defined
    }, process.env.JWT_KEY!);

    // store it on session object
    req.session = {
      jwt: userJwt
    }

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
