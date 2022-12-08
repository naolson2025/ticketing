import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  // // create a user
  // const signupResp = await request(app)
  //   .post('/api/users/signup')
  //   .send({
  //     email: 'test@test.com',
  //     password: 'password',
  //   })
  //   .expect(201);
  // // get the cookie for the signed in user
  // const cookie = signupResp.get('Set-Cookie');

  // we can use the global function we created in setup.ts to replace the
  // the above block of code
  // to signup a user and get the cookie
  const cookie = await global.signup();
  
  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  // if the user is not authenticated, the cookie should be empty
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
})