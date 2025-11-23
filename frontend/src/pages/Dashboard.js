import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import API from '../services/api';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [user, setUser] = useState(null);

  // Load logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle post creation
  const handleCreate = async e => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to create a post');
    if (!title.trim() || !content.trim()) return alert('Title and content cannot be empty');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      if (image) formData.append('image', image);

      const response = await API.post('/posts', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      console.log('Post created:', response.data);
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (err) {
      console.error('Cannot create post:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Cannot create post.');
    }
  };

  // Handle image selection
  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      {/* Create Post Form */}
      <form onSubmit={handleCreate} className="mb-8 bg-blue-100 shadow-lg rounded-lg p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a Post</h2>

        <input
          type="text"
          placeholder="Title"
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Content"
          className="border border-gray-300 rounded-lg p-3 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none"
          value={content}
          onChange={e => setContent(e.target.value)}
        />

        <div className="flex items-center mb-3 space-x-4">
          <input
            type="file"
            onChange={handleImageChange}
            className="text-gray-500"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-md border border-gray-200"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-colors duration-200"
        >
          Post
        </button>
      </form>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 && <p className="text-gray-500 text-center col-span-full">No posts yet.</p>}
        {posts.map(post => (
          <PostCard key={post.id} post={post} fetchPosts={fetchPosts} />
        ))}
      </div>
    </div>
  );
}
