import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const db = new Database(process.env.DB_PATH);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )
`);

const users = [
    { username: 'admin01', password: '123123', role: 'admin' },
    { username: 'user01', password: '123123', role: 'user' },
];

users.forEach(({ username, password, role }) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const existingUser = db
        .prepare('SELECT * FROM users WHERE username = ?')
        .get(username);

    if (!existingUser) {
        db.prepare(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
        ).run(username, hashedPassword, role);
    }
});

export default db;
