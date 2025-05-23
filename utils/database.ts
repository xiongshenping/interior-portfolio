import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
    try {
        db = SQLite.openDatabaseSync('interiorDesigner.db');

        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS designs (
                                                   id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                   title TEXT NOT NULL,
                                                   category TEXT NOT NULL,
                                                   image TEXT NOT NULL,
                                                   description TEXT
            );
        `);

        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

        const result = await db.getFirstAsync<{ count: number }>(
            'SELECT COUNT(*) as count FROM designs'
        );
        const count = result?.count || 0;

        if (count === 0) {
            await db.runAsync(
                'INSERT INTO designs (title, category, image, description) VALUES (?, ?, ?, ?)',
                'Cozy Apartment',
                'Living Room',
                'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300',
                'A cozy living room...'
            );
            await db.runAsync(
                'INSERT INTO designs (title, category, image, description) VALUES (?, ?, ?, ?)',
                'Minimalist Bedroom',
                'Bedroom',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300',
                'A minimalist bedroom...'
            );
        }
    } catch (error) {
        console.error('Database initialization error:', error);
    }
};

export const getAllDesigns = async () => {
    const results = await db.getAllAsync<Design>('SELECT * FROM designs');
    return results;
};

export const getDesignsByCategory = async (category: string) => {
    const results = await db.getAllAsync<Design>(
        'SELECT * FROM designs WHERE category = ?',
        category
    );
    return results;
};

export const getDesignById = async (id: number) => {
    const result = await db.getFirstAsync<Design>('SELECT * FROM designs WHERE id = ?', id);
    return result;
};

export const getUserByEmailAndPassword = async (email: string, password: string) => {
    const result = await db.getFirstAsync<{ email: string }>(
        'SELECT email FROM users WHERE email = ? AND password = ?',
        email,
        password
    );
    return result;
};

export const registerUser = async (email: string, password: string) => {
    try {
        await db.runAsync(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            email,
            password
        );
        return true;
    } catch (error) {
        console.error('Error registering user:', error);
        return false;
    }
};

interface Design {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
}
