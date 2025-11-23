const db = require('../config/db');

const Post = {
  create: async (title, content, image, userId) => {
    try {
      const [result] = await db.execute(
        'INSERT INTO posts (title, content, image, userId) VALUES (?, ?, ?, ?)',
        [title, content, image, userId]
      );
      return result;
    } catch (err) {
      console.error('DB error:', err);
      throw err;
    }
  },

  getAll: async () => {
    const [rows] = await db.execute('SELECT * FROM posts ORDER BY id DESC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.execute('SELECT * FROM posts WHERE id = ?', [id]);
    return rows[0];
  },

  update: async (id, content) => {
    return db.execute('UPDATE posts SET content = ? WHERE id = ?', [content, id]);
  },

  delete: async (id) => {
    return db.execute('DELETE FROM posts WHERE id = ?', [id]);
  }
};

module.exports = Post;

