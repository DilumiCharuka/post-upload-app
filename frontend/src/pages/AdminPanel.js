
import { useEffect, useState } from 'react';
import API from '../services/api';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Fetch users
  const fetchUsers = async () => {
    const { data } = await API.get('/admin/users');
    setUsers(data);
  };

  // Fetch posts
  const fetchPosts = async () => {
    const { data } = await API.get('/posts');
    setPosts(data);
  };

  // Delete user
  const handleDeleteUser = async id => {
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  // Delete post
  const handleDeletePost = async id => {
    await API.delete(`/posts/${id}`);
    fetchPosts();
  };

  // Start editing a post
  const handleEditPost = post => {
    setEditingPost(post.id);
    setEditContent(post.content);
  };

  // Save edited post
  const handleSaveEdit = async id => {
    await API.put(`/posts/${id}`, { content: editContent });
    setEditingPost(null);
    setEditContent('');
    fetchPosts();
  };

  // Add comment to a post
  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    await API.post('/comments', { postId, content: commentText });
    setCommentText('');
    fetchPosts(); // Optional: refresh posts/comments
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-6">
      {/* Users Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-2">Users</h2>
        {users.map(u => (
          <div key={u.id} className="flex justify-between border-b py-2">
            <span>{u.username} ({u.role})</span>
            <button onClick={() => handleDeleteUser(u.id)} className="text-red-500">
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Posts Section */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold text-lg mb-2">Posts</h2>
        {posts.map(p => (
          <div key={p.id} className="border-b py-2 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{p.title}</span>
              <div className="space-x-2">
                <button onClick={() => handleEditPost(p)} className="text-blue-500">
                  Edit
                </button>
                <button onClick={() => handleDeletePost(p.id)} className="text-red-500">
                  Delete
                </button>
              </div>
            </div>

            {/* Edit content */}
            {editingPost === p.id && (
              <div className="flex flex-col space-y-2">
                <textarea
                  className="border p-2 rounded w-full"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button
                  onClick={() => handleSaveEdit(p.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
              </div>
            )}

            {/* Comment input */}
            <div className="flex space-x-2 mt-1">
              <input
                type="text"
                placeholder="Add comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border p-1 rounded flex-1"
              />
              <button
                onClick={() => handleAddComment(p.id)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
