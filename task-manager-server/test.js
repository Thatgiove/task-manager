const supertest = require('supertest');
const {app , initializeDatabase, sqlite3 }  = require('./index');
// Mock per il database
jest.mock('sqlite3', () => {
  return {
    Database: jest.fn(() => ({
      run: jest.fn(),
      prepare: jest.fn(),
      close: jest.fn(),
    })),
  };
});

describe('POST /tasks', () => {
  let db;

  beforeAll(async () => {
    // Usa un mock o un database in-memory per isolare i test
    db = new sqlite3.Database(':memory:');
    // Inizializza solo il database in-memory, non eseguire la connessione di produzione
    await initializeDatabase();
  });

  afterAll(() => {
    // Chiudi il database dopo i test
    db.close();
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


