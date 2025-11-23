import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';

export default function PostDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);
  const [editingPost, setEditingPost] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch post and comments
  useEffect(() => {
    if (!user) return;

    const fetchPost = async () => {
      try {
        const { data } = await API.get(`/posts/${id}`);
        setPost(data);
        setEditPostContent(data.content);

        if (location.search.includes('edit=true') && user.id === data.userId) {
          setEditingPost(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchComments = async () => {
      try {
        const { data } = await API.get(`/comments/post/${id}`);
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
    fetchComments();
  }, [id, user, location.search]);

  if (!post || !user) return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  // Post actions
  const handleDeletePost = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPost = async () => {
    try {
      await API.put(`/posts/${id}`, { content: editPostContent });
      setEditingPost(false);
      setPost(prev => ({ ...prev, content: editPostContent }));
    } catch (err) {
      console.error(err);
    }
  };

  // Comment actions
  const handleComment = async e => {
    e.preventDefault();
    if (!content) return;
    try {
      await API.post(`/comments`, { postId: id, content });
      setContent('');
      const { data } = await API.get(`/comments/post/${id}`);
      setComments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async commentId => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditComment = async commentId => {
    try {
      await API.put(`/comments/${commentId}`, { content: editCommentContent });
      setEditingCommentId(null);
      setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editCommentContent } : c));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-6">
      {/* Post */}
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="font-bold text-2xl text-gray-800 mb-4">{post.title}</h2>

        {editingPost ? (
          <>
            <textarea
              className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={editPostContent}
              onChange={e => setEditPostContent(e.target.value)}
            />
            <div className="flex space-x-3">
              <button onClick={handleEditPost} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Save
              </button>
              <button onClick={() => setEditingPost(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-700">{post.content}</p>
        )}

        {post.image && (
          <img
            src={`http://localhost:5000/uploads/${post.image}`}
            alt="post"
            className="mt-4 w-full max-h-80 object-cover rounded-md border border-gray-200"
          />
        )}

        {user.id === post.userId && !editingPost && (
          <div className="mt-4 flex space-x-3">
            <button onClick={() => setEditingPost(true)} className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors duration-200">Edit Post</button>
            <button onClick={handleDeletePost} className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200">Delete Post</button>
          </div>
        )}
      </div>

      {/* Add Comment */}
      <form onSubmit={handleComment} className="bg-white shadow-lg rounded-lg p-4 border border-gray-200">
        <textarea
          placeholder="Add a comment..."
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200">Comment</button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map(c => (
          <div key={c.id} className="bg-gray-50 shadow-sm rounded-lg p-3 border border-gray-200">
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

            {(user.id === c.user_id || user.id === post.userId) && editingCommentId !== c.id && (
              <div className="mt-2 flex space-x-2">
                {user.id === c.user_id && (
                  <button onClick={() => { setEditingCommentId(c.id); setEditCommentContent(c.content); }} className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded-lg transition-colors duration-200">Edit</button>
                )}
                <button onClick={() => handleDeleteComment(c.id)} className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg transition-colors duration-200">Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
