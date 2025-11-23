const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  create: async (username, email, password, role = 'user') => {
    const hash = await bcrypt.hash(password, 10);
    return db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hash, role]
    );
  },
  findByEmail: (email) => db.execute('SELECT * FROM users WHERE email = ?', [email]),
  findById: (id) => db.execute('SELECT * FROM users WHERE id = ?', [id]),
  findAll: () => db.execute('SELECT id, username, email, role FROM users')
};

module.exports = User;
