import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function PostCard({ post, fetchPosts }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/post/${post.id}`);
        setComments(data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    };
    fetchComments();
  }, [user, post.id]);

  if (!user) return null;

  const canManagePost = user.id === post.userId || user.role === 'admin';

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await API.delete(`/posts/${post.id}`);
      fetchPosts();
    } catch (err) {
      alert('Cannot delete post.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      alert('Cannot delete comment.');
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editCommentContent.trim()) return;
    try {
      await API.put(`/comments/${commentId}`, { content: editCommentContent });
      setEditingCommentId(null);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editCommentContent } : c));
    } catch (err) {
      alert('Failed to update comment.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-semibold text-xl text-gray-800 mb-3">{post.title}</h3>
      <p className="text-gray-700 mb-3">{post.content}</p>

      {post.image && (
        <img
          src={`http://localhost:5000/uploads/${post.image}`}
          alt="post"
          className="w-full max-h-64 object-cover rounded-lg mb-4 border border-gray-200"
        />
      )}

      <div className="flex flex-wrap items-center space-x-4 mb-4">
        <Link to={`/posts/${post.id}`} className="text-blue-500 hover:underline font-medium">View</Link>
        {canManagePost && (
          <>
            <Link to={`/posts/${post.id}?edit=true`} className="text-green-500 hover:underline font-medium">Edit</Link>
            <button onClick={handleDeletePost} className="text-red-500 hover:underline font-medium">Delete</button>
          </>
        )}
      </div>

      {/* Comments Section */}
      <div className="space-y-3">
        {comments.map(c => {
          const canManageComment = user.id === c.user_id || user.role === 'admin';
          return (
            <div key={c.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200 shadow-sm">
              {editingCommentId === c.id ? (
                <>
                  <textarea
                    className="border border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={editCommentContent}
                    onChange={e => setEditCommentContent(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <button onClick={() => handleEditComment(c.id)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg transition-colors duration-200">Save</button>
                    <button onClick={() => setEditingCommentId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg transition-colors duration-200">Cancel</button>
                  </div>
                </>
              ) : (
                <p className="text-gray-700">{c.content}</p>
              )}

              {canManageComment && editingCommentId !== c.id && (
                <div className="mt-2 flex space-x-2">
                  {user.id === c.user_id && (
                    <button onClick={() => { setEditingCommentId(c.id); setEditCommentContent(c.content); }} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors duration-200">Edit</button>
                  )}
                  <button onClick={() => handleDeleteComment(c.id)} className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-colors duration-200">Delete</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
