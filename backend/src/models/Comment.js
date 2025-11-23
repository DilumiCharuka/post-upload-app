
const db = require('../config/db');

const Comment = {
  create: (userId, postId, content) =>
    db.execute('INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)', [userId, postId, content]),

  findByPostId: (postId) =>
    db.execute('SELECT * FROM comments WHERE post_id=? ORDER BY id DESC', [postId]),

  findById: (id) =>
    db.execute('SELECT * FROM comments WHERE id=?', [id]),

  update: (id, content) =>
    db.execute('UPDATE comments SET content=? WHERE id=?', [content, id]),

  delete: (id) =>
    db.execute('DELETE FROM comments WHERE id=?', [id])
};

module.exports = Comment;

