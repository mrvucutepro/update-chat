import BetterSqlite3 from 'better-sqlite3';

export function saveMessage(
    db: BetterSqlite3.Database,
    key: string,
    value: string
) {
    const stmt = db.prepare('INSERT INTO messages (key, value) VALUES (?, ?)');
    stmt.run(key, JSON.stringify(value));
}

export function getMessages(db: BetterSqlite3.Database) {
    const stmt = db.prepare('SELECT * FROM messages');
    const rows = stmt.all() as { key: string; value: string }[];

    return rows.map((row) => ({
        key: row.key,
        ...JSON.parse(row.value),
    }));
}
