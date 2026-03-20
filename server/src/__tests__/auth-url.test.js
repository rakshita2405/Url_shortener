import request from 'supertest';
import app from '../app.js';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';
import crypto from 'crypto';

describe('Auth and URL APIs', () => {
  const random = crypto.randomBytes(6).toString('hex');
  const userData = {
    username: `testuser_${random}`,
    email: `testuser_${random}@example.com`,
    password: 'TestPass123!'
  };

  let token;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  test('Register route should create user and return token', async () => {
    const res = await request(app).post('/api/auth/register').send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toMatchObject({ username: userData.username, email: userData.email });

    token = res.body.data.token;
  });

  test('Login route should return token for registered user', async () => {
    const res = await request(app).post('/api/auth/login').send({ identifier: userData.email, password: userData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.email).toBe(userData.email);
  });

  test('Profile route should return logged-in user', async () => {
    const res = await request(app).get('/api/auth/profile').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toMatchObject({ username: userData.username, email: userData.email });
  });

  test('Create URL route should work with valid token and return URL', async () => {
    const payload = { longUrl: 'https://www.example.com' };

    const res = await request(app)
      .post('/api/url/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('shortUrl');
    expect(res.body.data.longUrl).toBe(payload.longUrl);
  });

  test('Get user URLs route should return list of created URLs', async () => {
    const res = await request(app).get('/api/url/me').set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});