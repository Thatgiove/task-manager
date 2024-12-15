const sqlite3 = require('sqlite3').verbose();
let db;

//DB
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db = new sqlite3.Database(':memory:', (err) => {
            if (err) {
                return reject('Errore nella creazione del database: ' + err.message);
            }
            console.log('Connessione al database in-memory avvenuta con successo.');

            // Creazione della tabella boards
            db.run(
                `CREATE TABLE IF NOT EXISTS boards (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL
        )`,
                (err) => {
                    if (err) {
                        return reject('Errore nella creazione della tabella boards: ' + err.message);
                    }

                    console.log('Tabella boards creata con successo.');

                    const boards = ['TODO', 'IN PROGRESS', 'PENDING REVIEW', 'REJECTED', 'COMPLETED'];
                    const stmt = db.prepare('INSERT INTO boards (name) VALUES (?)');
                    boards.forEach((board) => stmt.run(board));
                    stmt.finalize();

                    // Creazione della tabella tasks
                    db.run(
                        `CREATE TABLE IF NOT EXISTS tasks (
                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                         title TEXT NOT NULL,
                         description TEXT,
                         boardId INTEGER NOT NULL,
                         dueDate TEXT,
                         FOREIGN KEY (boardId) REFERENCES boards (id)
                        )`,
                        (err) => {
                            if (err) {
                                return reject('Errore nella creazione della tabella tasks: ' + err.message);
                            }

                            console.log('Tabella tasks creata con successo.');

                            const dueDate = new Date().toISOString();

                            const insertTask = db.prepare('INSERT INTO tasks (title, description, boardId, dueDate) VALUES (?, ?, ?, ?)');

                            // Inserimento di task di esempio
                            insertTask.run('Task 1', 'Descrizione del Task 1', 1, dueDate, (err) => {
                                if (err) {
                                    console.error('Errore nell\'inserimento del Task 1:', err.message);
                                    reject(err);
                                } else {
                                    console.log('Task 1 inserito con successo.');
                                }
                            });

                            insertTask.run('Task 2', 'Descrizione del Task 2', 2, dueDate, (err) => {
                                if (err) {
                                    console.error('Errore nell\'inserimento del Task 2:', err.message);
                                    reject(err);
                                } else {
                                    console.log('Task 2 inserito con successo.');
                                    resolve(db); // Risolvi la Promise quando tutto è stato creato e inserito
                                }
                            });
                        }
                    );
                }
            );
        });
    });
};

module.exports = { initializeDatabase, getDb: () => db };