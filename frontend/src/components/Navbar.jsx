import { motion, AnimatePresence } from 'framer-motion';
import { Film, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // To navigate programmatically
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  // Handle Logout
  const handleLogout = () => {
    // Perform any logout actions (e.g., clearing tokens)
    localStorage.removeItem('token');
    navigate('/main'); // Navigate to the Main page after logout
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/70 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        {/* Logo Section */}
        <Link to="/home" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-md"
          >
            <Film className="h-8 w-8 text-white" />
          </motion.div>
          <motion.span
            className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1 }}
            transition={{
              duration: 0.8,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            Movie Master
          </motion.span>
        </Link>

        {/* Hamburger Menu (Mobile View) */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Navigation Links (Desktop View) */}
        <div className="hidden md:flex md:items-center md:gap-6">
          <NavLink to="/home" active={location.pathname === '/home'} key="home">
            Home
          </NavLink>
          <NavLink to="/my-list" active={location.pathname === '/my-list'} key="myList">
            My List
          </NavLink>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white font-medium rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden backdrop-blur-md bg-gray-900/90"
          >
            <div className="flex flex-col items-center gap-4 px-4 py-6">
              <NavLink to="/home" active={location.pathname === '/home'} key="home">
                Home
              </NavLink>
              <NavLink to="/my-list" active={location.pathname === '/my-list'} key="myList">
                My List
              </NavLink>
              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white font-medium"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`relative font-medium text-gray-300 transition-colors hover:text-white ${
        active ? 'text-white' : ''
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default Navbar;
