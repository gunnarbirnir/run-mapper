import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Text } from '~/primitives';

export const NavBar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/auth/login' });
  };

  return (
    <nav className="border-b border-gray-300 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex gap-6">
          <Link
            to="/"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          {user && (
            <>
              <Link
                to="/runs"
                activeProps={{
                  className: 'font-bold',
                }}
                activeOptions={{ exact: true }}
              >
                Runs
              </Link>
              <Link
                to="/runs/new"
                activeProps={{
                  className: 'font-bold',
                }}
              >
                New Run
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {loading ? (
            <Text className="text-gray-500">Loading...</Text>
          ) : user ? (
            <>
              <Text className="text-sm text-gray-600">{user.email}</Text>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <Button linkTo="/auth/login">Sign In</Button>
          )}
        </div>
      </div>
    </nav>
  );
};
