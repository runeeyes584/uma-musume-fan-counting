import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
const db = new Database(dbPath);

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS user_data (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    name TEXT,
    uid TEXT,
    club TEXT,
    good_endings INTEGER,
    careers INTEGER,
    total_fan INTEGER,
    total_races INTEGER,
    total_wins INTEGER,
    goal_for_week INTEGER,
    email TEXT,
    notification_enabled INTEGER DEFAULT 0,
    notification_time TEXT
  );

  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    fan INTEGER,
    date TEXT,
    created_at INTEGER
  );
`);

// Migration for existing databases (Try adding columns)
try {
    db.prepare('ALTER TABLE user_data ADD COLUMN notification_enabled INTEGER DEFAULT 0').run();
} catch (e) { /* Column likely exists */ }
try {
    db.prepare('ALTER TABLE user_data ADD COLUMN notification_time TEXT').run();
} catch (e) { /* Column likely exists */ }


// Initialize default user if not exists
const initStmt = db.prepare("INSERT OR IGNORE INTO user_data (id, name, total_fan) VALUES (1, 'Kaleidoscope', 0)");
initStmt.run();

export const loadData = () => {
    const userStmt = db.prepare('SELECT * FROM user_data WHERE id = 1');
    const user = userStmt.get() as any;

    const historyStmt = db.prepare('SELECT * FROM history ORDER BY created_at DESC');
    const history = historyStmt.all() as any[];

    if (!user) return null;

    // Map to frontend shape
    return {
        stats: {
            totalFan: user.total_fan || 0,
            totalRaces: user.total_races || 0,
            totalWins: user.total_wins || 0,
            goalForWeek: user.goal_for_week || 22000000,
            careers: user.careers || 0,
            goodEndings: user.good_endings || 0,
            club: user.club || 'ThinkFast',
            name: user.name || 'Kaleidoscope',
            uid: user.uid || '124378237',
            email: user.email || 'example@gmail.com',
            notificationEnabled: !!user.notification_enabled,
            notificationTime: user.notification_time || ''
        },
        history: history.map(h => ({
            id: h.id,
            name: h.name,
            fan: h.fan,
            date: h.date
        }))
    };
};

export const saveData = (data: any) => {
    // Transaction to update both
    const updateStats = db.prepare(`
        UPDATE user_data SET 
            total_fan = @totalFan,
            total_races = @totalRaces,
            total_wins = @totalWins,
            goal_for_week = @goalForWeek,
            careers = @careers,
            good_endings = @goodEndings,
            club = @club,
            name = @name,
            uid = @uid,
            email = @email,
            notification_enabled = @notificationEnabled,
            notification_time = @notificationTime
        WHERE id = 1
    `);

    const insertHistory = db.prepare(`
        INSERT INTO history (name, fan, date, created_at)
        VALUES (@name, @fan, @date, @createdAt)
    `);

    const transaction = db.transaction((payload) => {
        updateStats.run({
            totalFan: payload.stats.totalFan,
            totalRaces: payload.stats.totalRaces,
            totalWins: payload.stats.totalWins,
            goalForWeek: payload.stats.goalForWeek,
            careers: payload.stats.careers,
            goodEndings: payload.stats.goodEndings,
            club: payload.stats.club,
            name: payload.stats.name,
            uid: payload.stats.uid,
            email: payload.stats.email,
            notificationEnabled: payload.stats.notificationEnabled ? 1 : 0,
            notificationTime: payload.stats.notificationTime
        });

        // 1. Get current DB IDs to identify deletions
        const currentIds = db.prepare('SELECT id FROM history').all().map((row: any) => row.id);
        const newIds = payload.history.map((h: any) => h.id);

        // 2. Delete items not in the new payload
        const toDelete = currentIds.filter((id: any) => !newIds.includes(id));
        const deleteStmt = db.prepare('DELETE FROM history WHERE id = ?');
        for (const id of toDelete) {
            deleteStmt.run(id);
        }

        // 3. Insert new items
        for (const item of payload.history) {
            const exists = db.prepare('SELECT 1 FROM history WHERE id = ?').get(item.id);
            if (!exists) {
                db.prepare('INSERT INTO history (id, name, fan, date, created_at) VALUES (?, ?, ?, ?, ?)').run(
                    item.id, item.name, item.fan, item.date, item.id
                );
            }
        }
    });

    transaction(data);
};
