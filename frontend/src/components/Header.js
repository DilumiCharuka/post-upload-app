import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-blue-500 p-4 flex justify-between items-center text-white">
      <h1 className="font-bold text-xl">PostApp</h1>
      <nav className="space-x-4">
        {user ? (
          <>
            <span>Hello, {user.username}</span>
          {user.role === 'admin' && (
  <Link
    to="/admin"
    className="bg-green-500 hover:bg-green-700 text-white font-bold px-3 py-1 rounded-lg shadow-lg transition-all transform hover:scale-105"
  >
    Admin Panel
  </Link>
)}


            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
