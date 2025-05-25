import * as SQLite from 'expo-sqlite';
import detailData from '../assets/detail-data.json';
import listData from '../assets/list-data.json';

let db: SQLite.SQLiteDatabase;

export const initDatabase = async () => {
  try {
    db = SQLite.openDatabaseSync('interiorDesigner.db');

    // remove
    await db.execAsync('DROP TABLE IF EXISTS favorites;');
    await db.execAsync('DROP TABLE IF EXISTS design_images;');
    await db.execAsync('DROP TABLE IF EXISTS design_texts;');
    await db.execAsync('DROP TABLE IF EXISTS designs;');
    await db.execAsync('DROP TABLE IF EXISTS users;');

    // create design table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS designs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT
      );
    `);

    // create design image table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS design_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        design_id INTEGER,
        url TEXT,
        FOREIGN KEY (design_id) REFERENCES designs(id)
      );
    `);

    // create design text table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS design_texts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        design_id INTEGER,
        content TEXT,
        FOREIGN KEY (design_id) REFERENCES designs(id)
      );
    `);

    // user talbe
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    // create consideration list table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        design_id INTEGER UNIQUE,
        added_at TEXT,
        FOREIGN KEY (design_id) REFERENCES designs(id)
      );
    `);

    console.log('load design data...');

    for (const item of listData.portfolio) {
      const { title, image, description, sector, link } = item;
      const category = Array.isArray(sector) ? sector.join(', ') : sector;

      await db.runAsync(
        'INSERT INTO designs (title, category, image, description) VALUES (?, ?, ?, ?)',
        title,
        category,
        image,
        description || ''
      );

      const inserted = await db.getFirstAsync<{ id: number }>(
        'SELECT id FROM designs WHERE title = ? AND image = ?',
        title,
        image
      );

      const designId = inserted?.id;
      if (!designId) continue;

      const detail = detailData.projects.find((proj) => proj.url === link);
      if (!detail) continue;

      for (const url of detail.images) {
        await db.runAsync(
          'INSERT INTO design_images (design_id, url) VALUES (?, ?)',
          designId,
          url
        );
      }

      for (const content of detail.texts) {
        await db.runAsync(
          'INSERT INTO design_texts (design_id, content) VALUES (?, ?)',
          designId,
          content
        );
      }

      console.log(`✅ loaded：${title} (ID: ${designId})`);
    }

    console.log('All design data imported');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

// get all design
export const getAllDesigns = async () => {
  return await db.getAllAsync<Design>('SELECT * FROM designs');
};
/*
export const getDesignsByCategory = async (category: string) => {
  return await db.getAllAsync<Design>(
    'SELECT * FROM designs WHERE category LIKE ?',
    `%${category}%`
  );
};*/

export const getDesignsByCategory = async (category: string) => {
  return await db.getAllAsync<Design>(
    `SELECT * FROM designs WHERE LOWER(category) LIKE ?`,
    [`%${category.toLowerCase()}%`]
  );
};
export const getDesignById = async (id: number) => {
  return await db.getFirstAsync<Design>(
    'SELECT * FROM designs WHERE id = ?',
    id
  );
};

// detail info
export const getDetailImagesByDesignId = async (designId: number) => {
  return await db.getAllAsync<{ url: string }>(
    'SELECT url FROM design_images WHERE design_id = ?',
    designId
  );
};

export const getDetailTextsByDesignId = async (designId: number) => {
  return await db.getAllAsync<{ content: string }>(
    'SELECT content FROM design_texts WHERE design_id = ?',
    designId
  );
};

// users
export const getUserByEmailAndPassword = async (email: string, password: string) => {
  return await db.getFirstAsync<{ email: string }>(
    'SELECT email FROM users WHERE email = ? AND password = ?',
    email,
    password
  );
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
    console.error('Registration failed:', error);
    return false;
  }
};

// add to consideration
export const addToFavorites = async (designId: number) => {
  try {
    await db.runAsync(
      'INSERT OR IGNORE INTO favorites (design_id, added_at) VALUES (?, ?)',
      designId,
      new Date().toISOString()
    );
    return true;
  } catch (error) {
    console.error("Failed to add to save list:", error);
    return false;
  }
};

export const getFavoriteDesigns = async (): Promise<Design[]> => {
  return await db.getAllAsync<Design>(`
    SELECT d.*
    FROM designs d
    JOIN favorites f ON d.id = f.design_id
    ORDER BY f.added_at DESC
  `);
};

export const removeFromFavorites = async (designId: number) => {
  await db.runAsync(
    'DELETE FROM favorites WHERE design_id = ?',
    designId
  );
};

// 
interface Design {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}
