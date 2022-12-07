import request from 'supertest';
import { app } from '../../app';

it('fails when an email that does not exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(400);
})

it('fails when an incorrect password is supplied', async () => {
  // create valid user
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  // try to sign as that user with invalid password
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'invalid password'
    })
    .expect(400);
})

it('responds with a cookie when signed in is valid', async () => {
  // create valid user
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  // try to signin as that user with password
  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200);
  
  expect(response.get('Set-Cookie')).toBeDefined();
})