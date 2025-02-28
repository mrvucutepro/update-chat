import Database from 'better-sqlite3';
import BetterSqlite3 from "better-sqlite3";

export async function initializeDB() {
    const db = new BetterSqlite3('./etc/database.db');

    db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL
    );
  `);

    return db;
}
