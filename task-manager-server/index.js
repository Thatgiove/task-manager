
const express = require('express');
const { initializeDatabase, getDb } = require('./db');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:9876'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

// API 
// Recupera tutte le board con i task associati
app.get('/boards', (req, res) => {
  const db = getDb();
  const query = `
    SELECT 
      boards.id AS boardId, 
      boards.name AS boardName, 

      tasks.id AS taskId, 
      tasks.title AS taskTitle, 
      tasks.description AS taskDescription,
      tasks.dueDate AS dueDate
    FROM boards
    LEFT JOIN tasks ON boards.id = tasks.boardId
  `;


  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(err.message)
      res.status(500).json({ error: 'Errore durante il recupero delle board e dei task' });
      return;
    }

    const boards = rows.reduce((acc, row) => {
      const board = acc.find(b => b.id === row.boardId);

      if (!board) {
        acc.push({
          id: row.boardId,
          name: row.boardName,
          tasks: row.taskId
            ? [{
              id: row.taskId,
              title: row.taskTitle,
              description: row.taskDescription,
              boardId: row.boardId,
              editMode : false,
              dueDate : row.dueDate
            }]
            : []
        });
      } else if (row.taskId) {
        board.tasks.push({
          id: row.taskId,
          title: row.taskTitle,
          description: row.taskDescription,
          boardId: row.boardId,
          editMode : false,
          dueDate : row.dueDate
        });
      }

      return acc;
    }, []);

    res.json(boards);
  });
});

app.post('/tasks', (req, res) => {
  const db = getDb();
  const { title, description } = req.body;

  const boardId = 1; // Assumendo che la boardId sia fissa per ora

  const insertTask = db.prepare('INSERT INTO tasks (title, description, boardId) VALUES (?, ?, ?)');
  insertTask.run(title, description, boardId, function (err) {
    if (err) {
      console.error('Errore nell\'inserimento del Task:', err.message);
      return res.status(500).json({ error: 'Errore nell\'inserimento del task' });
    }
    const newTask = {
      id: this.lastID, 
      title,
      description,
      boardId,
    };

    // Invia il nuovo task al client
    res.status(201).json(newTask);
  });
});


app.put('/tasks', (req, res) => {
  const db = getDb();
  const { title, description, id} = req.body;


  if (!title || !description) {
    return res.status(400).json({ error: 'Title e Description sono obbligatori' });
  }


  const updateTask = db.prepare('UPDATE tasks SET title = ?, description = ? WHERE id = ?');
  updateTask.run(title, description, id, function(err) {
    if (err) {
      return res.status(500).json({ error: 'Errore nell\'aggiornamento del task' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task non trovato' });
    }
    res.status(200).json({ message: 'Task aggiornato con successo' });
  });
});


app.delete('/tasks/:id', (req, res) => {
  const db = getDb();
  const taskId = req.params.id;

  const deleteTask = db.prepare('DELETE FROM tasks WHERE id = ?');
  deleteTask.run(taskId, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Errore nell\'eliminazione del task' });
    }
    res.status(200).json({ message: 'Task eliminato con successo' });
  });
});

app.put('/tasks/:id/move', (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { boardId } = req.body;

  const updateTask = db.prepare('UPDATE tasks SET boardId = ? WHERE id = ?');
  updateTask.run(boardId, id, function (err) {
    if (err) {
      console.error('Errore durante lo spostamento del task:', err.message);
      return res.status(500).json({ error: 'Errore nello spostamento del task' });
    }

    if (this.changes > 0) {
      res.status(200).json({ id, boardId });
    } else {
      res.status(404).json({ error: 'Task non trovato' });
    }
  });
});


// start
const startServer = () => {
  if (require.main === module) 
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};


const initializeApp = async () => {
  try {
    await initializeDatabase();
    console.log('Database inizializzato con successo. Avvio del server...');
    startServer();
  } catch (error) {
    console.error('Errore nell\'inizializzazione del database: ', error);
  }
};

if (require.main === module) {
  initializeApp();
}

module.exports = { app };