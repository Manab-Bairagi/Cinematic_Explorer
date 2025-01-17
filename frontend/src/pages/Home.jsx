import { useQuery } from '@tanstack/react-query';
import { motion, useAnimation, useInView } from 'framer-motion';
import { MovieCard } from '../components/MovieCard';
import { SearchBar } from '../components/SearchBar';
import { GenreTiles } from '../components/GenreTiles';
import { movieApi } from '../lib/tmdb';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hovered, setHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const { data: trendingData, isLoading: isTrendingLoading, isError: isTrendingError } = useQuery({
    queryKey: ['trending'],
    queryFn: movieApi.getTrending,
    enabled: !searchQuery,
  });

  const { data: searchData, isLoading: isSearchLoading, isError: isSearchError } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => movieApi.searchMovies(searchQuery),
    enabled: !!searchQuery,
  });

  const movies = searchQuery ? searchData?.results : trendingData?.results;
  const isLoading = searchQuery ? isSearchLoading : isTrendingLoading;
  const isError = searchQuery ? isSearchError : isTrendingError;

  const handleTextClick = () => {
    setIsClicked(!isClicked);
    navigate('/my-list');
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center text-white"
        >
          <h1 className="mb-8 text-3xl font-bold sm:text-4xl lg:text-5xl xl:text-6xl cursor-pointer">
            Discover Your Next
            <span 
              className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl transition-all duration-500 ${hovered ? 'text-indigo-500' : 'text-white'}`}
              onClick={handleTextClick}
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
            >
              "Favourite Movie"
            </span>
          </h1>
          <h4
            className={`mb-4 text-lg sm:text-xl lg:text-2xl cursor-pointer`}
            onClick={handleTextClick}
            onMouseEnter={() => setHovered(true)} 
            onMouseLeave={() => setHovered(false)}
          >
            Get personalized movie recommendations based on your taste...
          </h4>
          <SearchBar onSearch={setSearchQuery} />
        </motion.div>

        {/* Genre Tiles Section */}
        {!searchQuery && <GenreTiles />}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <motion.div
              className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center text-red-500">
            Oops! Something went wrong. Please try again later.
          </div>
        )}

        {/* No Results State */}
        {!isLoading && movies?.length === 0 && (
          <div className="text-center text-gray-500">
            No movies found. Try a different search query.
          </div>
        )}

        {/* Movie Grid */}
        {movies && movies.length > 0 && (
          <motion.div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {movies.map((movie) => (
              <MovieCardWithScrollAnimation key={movie.id} movie={movie} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Individual Movie Card with Scroll Animation
function MovieCardWithScrollAnimation({ movie }) {
  const ref = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(ref, { once: false, margin: '0px 0px -150px 0px' });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          scale: 0.8,
          y: 50,
          filter: 'blur(10px)',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        visible: {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: 'blur(0)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
      }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <MovieCard movie={movie} />
    </motion.div>
  );
}

export default Home;