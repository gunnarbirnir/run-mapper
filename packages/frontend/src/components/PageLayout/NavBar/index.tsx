import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { useAuth } from '~/contexts/AuthContext';
import { Button, Text, Icon } from '~/primitives';

export const NavBar = () => {
  const { user, loading, logOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOnLoginPage = pathname === '/auth/login';

  const handleLogout = async () => {
    await logOut();
    navigate({ to: '/auth/login', search: { redirect: undefined } });
  };

  return (
    <nav className="sticky top-0 z-10 bg-gray-50 px-4 py-2 opacity-95 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/">
            <Icon name="spretta" className="size-8" />
          </Link>
          {user && (
            <>
              <Link
                to="/editor/runs"
                activeProps={{
                  className: 'font-bold',
                }}
                activeOptions={{ exact: true }}
                className="hidden sm:block"
              >
                <Text>My Runs</Text>
              </Link>
              <Link
                to="/editor/runs/new"
                activeProps={{
                  className: 'font-bold',
                }}
                className="hidden sm:block"
              >
                <Text>New Run</Text>
              </Link>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Text className="hidden text-sm text-gray-600 sm:block">
                {user.email}
              </Text>
              <Button onClick={handleLogout}>Log out</Button>
            </>
          ) : isOnLoginPage ? (
            <Button linkTo="/auth/signup" isLoading={loading}>
              Sign up
            </Button>
          ) : (
            <Button linkTo="/auth/login" isLoading={loading}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
