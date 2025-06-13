import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import type { JSX } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from './ui/dropdown-menu';


function Header(): JSX.Element {
  const { user, isLoading, logout } = useAuth();

  return (
    <header className='w-full px-4 py-2 flex items-center gap-2 justify-between'>
      <div className='hidden md:flex w-full items-center gap-2 justify-between'>
        <div className='flex items-center gap-1'>
          <img
            src="src/assets/ManxaLogo.png"
            alt="Manxa Logo"
            className='w-34 bg-transparent mr-2'
          />
          <nav className='flex gap-1 font-medium'>
            <Button variant="ghost" asChild>
              <Link to="/">
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="discover">
                Discover
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="myManxa">
                MyManxa
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="history">
                History
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="profile">
                Profile
              </Link>
            </Button>
          </nav>
        </div>
        <div>
          {isLoading ? (
            <span>Loading...</span>
          ) : user ? (
            <div className='flex items-center gap-2'>
              <div className='flex gap-1'>
                <svg className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account</title><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
                <div className='relative mr-auto min-md:max-w-15 min-lg:max-w-80 overflow-hidden text-ellipsis whitespace-nowrap'>
                  <span className='font-medium text-base'>{user.user_name}</span>
                </div>
              </div>
              <Button variant="outline" className='cursor-pointer' onClick={logout}>
                <p className='w-full test-sm font-medium'>Logout</p>
              </Button>
            </div>
          ) : (
            <Button variant="outline" asChild>
              <Link to="login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className='md:hidden w-full flex items-center gap-2 justify-between'>
        <img
          src="src/assets/ManxaLogo.png"
          alt="Manxa Logo"
          className='w-34 bg-transparent mr-2'
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className='focus-visible:ring-0 cursor-pointer'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>menu</title><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>
              Menu
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='mr-4'>
            {user ? (
              <>
                <DropdownMenuLabel className='max-w-140 overflow-hidden text-ellipsis whitespace-nowrap font-bold text-base flex gap-1'>
                  <div>
                    <svg className="w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>account</title><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>
                  </div>
                  {user.user_name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            ) : (
              <DropdownMenuItem className='flex items-center justify-center focus:bg-red'>
                <Button>
                  <Link to="login" className='w-full'>Login</Link>
                </Button>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <Link to="/" className='w-full font-medium text-sm'>Home</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="discover" className='w-full font-medium text-sm'>Discover</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="myManxa" className='w-full font-medium text-sm'>MyManxa</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="history" className='w-full font-medium text-sm'>History</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="profile" className='w-full font-medium text-sm'>Profile</Link>
            </DropdownMenuItem>
            {user ? (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className='w-full'>
                  <Link to="/" className='w-full font-medium text-sm'>Logout</Link>
                </DropdownMenuItem>
              </>
            ): <></>}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
