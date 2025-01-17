import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router
import { ChevronDown, Film, Star, Users, Play, Camera } from 'lucide-react';

const quotes = [
  { text: "Cinema is a matter of what's in the frame and what's out.", author: "Martin Scorsese" },
  { text: "Cinema is universal, beyond flags and borders and passports.", author: "Alejandro González Iñárritu" },
  { text: "Cinema is the most beautiful fraud in the world.", author: "Jean-Luc Godard" }
];

function MainPage() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleExploreClick = () => {
    navigate('/authform'); // Navigate to the AuthForm page
  };

  return (
    <div className="relative bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute liquid-shape"
              style={{
                left: `${i * 30}%`,
                top: `${i * 20}%`,
                width: '600px',
                height: '600px',
                background: 'linear-gradient(45deg, rgba(88, 28, 135, 0.1), rgba(124, 58, 237, 0.1))',
                filter: 'blur(60px)',
                transform: `rotate(${i * 45}deg)`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
          <Film className="w-16 h-16 mb-8 animate-spin-slow text-violet-400" />
          <div className="text-center max-w-2xl mx-auto mb-12 h-32 flex items-center justify-center">
            <div className="animate-fade-in">
              <p className="text-xl md:text-3xl lg:text-4xl font-light mb-4 italic text-violet-100">
                "{quotes[currentQuote].text}"
              </p>
              <p className="text-violet-400">- {quotes[currentQuote].author}</p>
            </div>
          </div>

          <button
            onClick={handleExploreClick}
            className="group relative px-8 py-3 bg-violet-600 text-white rounded-full font-semibold 
                     transform hover:scale-105 transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
          >
            <span className="relative z-10">Explore Now</span>
            <div className="absolute inset-0 bg-violet-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </button>

          <ChevronDown
            className="absolute bottom-8 animate-bounce w-8 h-8 cursor-pointer text-violet-400"
            onClick={handleExploreClick}
          />
        </div>
      </div>

      {/* Features and About Sections */}
      <div id="content" className="relative">
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
              Experience Cinema Like Never Before
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {[
                { icon: Star, title: "Curated Selection", desc: "Handpicked films from around the world" },
                { icon: Users, title: "Community", desc: "Join discussions with fellow cinema enthusiasts" },
                { icon: Camera, title: "Behind the Scenes", desc: "Exclusive content and making-of features" },
              ].map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="group bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl
                              border border-violet-900/20 transform hover:-translate-y-2 
                              transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
                >
                  <Icon className="w-12 h-12 text-violet-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
                  <p className="text-violet-200/80">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20 px-4 bg-gray-900/30 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">About Our Platform</h2>
            <p className="text-violet-200/80 text-lg leading-relaxed mb-12">
              Discover a world of cinema through our carefully curated platform. 
              From classic masterpieces to contemporary gems, immerse yourself in 
              the art of storytelling through film.
            </p>
            <Play className="w-16 h-16 text-violet-400 mx-auto animate-pulse" />
          </div>
        </section>
      </div>
    </div>
  );
}

export default MainPage;
