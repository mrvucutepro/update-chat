// import { Database } from 'better-sqlite3';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// const SECRET_KEY = 'your_secret_key';

// interface User {
//   id: number;
//   username: string;
//   password: string;
// }

// export async function registerUser(
//     db: Database,
//     username: string,
//     password: string
// ) {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const stmt = db.prepare(
//         'INSERT INTO users (username, password) VALUES (?, ?)'
//     );
//     stmt.run(username, hashedPassword);
//     return { message: 'Register successfully' };
// }

// export async function loginUser(
//     db: Database,
//     username: string,
//     password: string
// ) {
//     const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
//     const user = stmt.get(username) as User | undefined;

//     if (!user) {
//         throw new Error('wrong username or password');
//     }

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//         throw new Error('wrong password');
//     }

//     const token = jwt.sign(
//         { userId: user.id, username: user.username },
//         SECRET_KEY,
//         { expiresIn: '1h' }
//     );
//     return { token };
// }
import db from './db';
import bcrypt from 'bcrypt';

export async function registerUser(username: string, password: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);
  const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  stmt.run(username, hashedPassword);
}

export async function findUserByUsername(username: string): Promise<{ id: number, username: string, password: string } | undefined> {
  const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
  return stmt.get(username) as { id: number, username: string, password: string } | undefined;
}