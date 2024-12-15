const supertest = require('supertest');
const {initializeDatabase }  = require('./db');
const {app }  = require('./index');


describe('POST /tasks', () => {
  beforeAll(async () => {
    await initializeDatabase();
  });

  test('should create a new task', async () => {
    const newTask = { title: 'Test Task', description: 'Test Description' };

    await supertest(app)
      .post('/tasks')
      .send(newTask)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
  });

})


