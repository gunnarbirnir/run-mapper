import { Link, useLocation, useNavigate } from '@tanstack/react-router';

import { useAuthState } from '~/hooks/useAuthState';
import { Button, Text, Icon } from '~/primitives';
import { cn } from '~/utils';

export const NavBar = () => {
  const { user, isLoaded, logOut } = useAuthState();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOnLoginPage = pathname === '/auth/login';

  const handleLogout = async () => {
    await logOut();
    navigate({ to: '/auth/login', search: { redirect: undefined } });
  };

  return (
    <nav className="sticky top-0 z-10 bg-gray-50/95 px-4 py-2 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/">
            <Icon name="spretta" className="size-8" />
          </Link>
          {user && (
            <>
              <Link
                to="/"
                className={cn('hidden sm:block', {
                  'font-bold': pathname === '/' || pathname === '/home',
                })}
              >
                <Text>Home</Text>
              </Link>
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
            <Button
              linkTo="/auth/signup"
              isLoading={!isLoaded}
              className="min-w-24"
            >
              Sign up
            </Button>
          ) : (
            <Button
              linkTo="/auth/login"
              isLoading={!isLoaded}
              className="min-w-24"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};
