import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from './button';
import type { JSX } from 'react';


function Header(): JSX.Element {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className='w-full px-4 py-2 flex items-center gap-2 justify-between'>
      <div className='flex items-center gap-1'>
        <img
          src="src/assets/ManxaLogo.png"
          alt="Manxa Logo"
          className='w-28 bg-transparent mr-2'
        />
        <nav className='flex gap-1 font-medium'>
          <Link to="/" className='hover:bg-gray-100 p-2 rounded-md'>
            Home
          </Link>
          <Link to="discover" className='hover:bg-gray-100 p-2 rounded-md'>
            Discover
          </Link>
          <Link to="myManxa" className='hover:bg-gray-100 p-2 rounded-md'>
            MyManxa
          </Link>
          <Link to="history" className='hover:bg-gray-100 p-2 rounded-md'>
            History
          </Link>
          <Link to="profile" className='hover:bg-gray-100 p-2 rounded-md'>
            Profile
          </Link>
        </nav>
      </div>
      <div>
        {isLoading ? (
          <span>Loading...</span>
        ) : user ? (
          <div className='flex items-center gap-2'>
            <span className='font-medium'>{user.user_name}</span>
            <Button className='bg-gray-800 text-white' onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="outline" >
            <Link to="login">Login</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default Header;
