import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  // to sign out the user we need to send a header back to the browser
  // the header will tell the browser to delete the cookie
  req.session = null;
  res.send({});
});

export { router as signoutRouter };