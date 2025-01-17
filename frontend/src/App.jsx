import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { MovieDetails } from './pages/MovieDetails';
import { MyList } from './pages/MyList';
import { Navbar } from './components/Navbar';
import MainPage from './pages/MainPage';
import AuthForm from './components/AuthForm';

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [backgroundImage, setBackgroundImage] = useState('');

  // Function to determine the background based on time of day
  const updateBackground = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 18) {
      // Daytime background
      setBackgroundImage('https://images.unsplash.com/photo-1519802871372-f42a968c1b8d'); // Daytime image
    } else {
      // Nighttime background
      setBackgroundImage('https://images.unsplash.com/photo-1490559070619-53a707104c66'); // Nighttime image
    }
  };

  // Update background on component mount
  useEffect(() => {
    updateBackground(); // Set initial background based on the time of day
    const interval = setInterval(updateBackground, 60000); // Update background every minute
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-900 text-white">
          {/* Dynamic Background with image */}
          <div className="fixed inset-0 -z-10">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
          </div>

          {/* Conditionally render Navbar */}
          <ConditionalNavbar />

          {/* Define Routes */}
          <Routes>
            <Route path="/" element={<NavigateToNextPage />} />
            <Route path="/main" element={<MainPageNavigator />} />
            <Route path="/authform" element={<AuthFormNavigator />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/my-list" element={<MyList />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

// Component to conditionally render Navbar
function ConditionalNavbar() {
  const location = useLocation();
  const hideNavbarRoutes = ['/main', '/authform'];

  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return <Navbar />;
}

// Component to handle navigation from "/" to "/main"
function NavigateToNextPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/main");
  }, [navigate]);
  return null;
}

// Component to handle the MainPage and navigate to AuthForm
function MainPageNavigator() {
  const navigate = useNavigate();
  const handleExploreClick = () => {
    navigate("/authform");
  };

  return <MainPage onExploreClick={handleExploreClick} />;
}

// Component to handle the AuthForm and navigate to HomePage
function AuthFormNavigator() {
  const navigate = useNavigate();

  const handleAuthentication = () => {
    navigate("/home");
  };

  return <AuthForm setIsAuthenticated={handleAuthentication} />;
}

export default App;
