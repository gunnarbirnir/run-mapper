import { Link } from '@tanstack/react-router';

export const NavBar = () => {
  return (
    <nav className="p-4 border-b border-gray-300">
      <div className="container mx-auto flex gap-6">
        <Link
          to="/"
          activeProps={{
            className: 'font-bold',
          }}
          activeOptions={{ exact: true }}
        >
          Home
        </Link>
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
      </div>
    </nav>
  );
};
