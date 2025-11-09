import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-bold">
          <Link href="/">MyApp</Link>
        </div>
        <div className="space-x-4">
          <Link href="/form" className="text-gray-300 hover:text-white">Intention</Link>
          <Link href="/admin" className="text-gray-300 hover:text-white">Admin</Link>
          <Link href="/register" className="text-gray-300 hover:text-white">Register</Link>
          <Link href="/login" className="text-gray-300 hover:text-white">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;