import { motion, AnimatePresence } from 'framer-motion';
import { Film, Theater, Heart, Sword, Rocket, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieApi } from '../lib/tmdb';
import { MovieCard } from './MovieCard'; 

const genres = [
  { id: 28, name: 'Action', icon: Sword, gradient: 'bg-gradient-to-br from-red-500 to-orange-500' },
  { id: 18, name: 'Drama', icon: Theater, gradient: 'bg-gradient-to-br from-blue-500 to-indigo-500' },
  { id: 10749, name: 'Romance', icon: Heart, gradient: 'bg-gradient-to-br from-pink-500 to-purple-500' },
  { id: 878, name: 'Sci-Fi', icon: Rocket, gradient: 'bg-gradient-to-br from-purple-500 to-blue-500' },
  { id: 12, name: 'Adventure', icon: Film, gradient: 'bg-gradient-to-br from-green-500 to-teal-500' },
];

export function GenreTiles() {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Query for fetching movies by genre using Flask API
  const { data: genreMovies } = useQuery({
    queryKey: ['genre', selectedGenre?.id],
    queryFn: () => movieApi.getMoviesByGenre(selectedGenre.id),  // Fetch from Flask API
    enabled: !!selectedGenre,  // Trigger only when genre is selected
  });

  const handleGenreClick = (genre) => {
    if (!isDragging) {
      setSelectedGenre(genre);
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setTimeout(() => setSelectedGenre(null), 300);
  };

  const handleMouseDown = (e) => {
    setIsDragging(false);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseMove = (e) => {
    if (!scrollContainerRef.current) return;
    
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative mb-12">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-semibold text-center"
      >
        Popular Genres
      </motion.h2>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent z-10 pointer-events-none" />
        
        <motion.div
          ref={scrollContainerRef}
          className="flex gap-6 pb-4 overflow-x-auto scrollbar-hide mx-4 cursor-grab select-none justify-center"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex-shrink-0"
              onClick={() => handleGenreClick(genre)}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${genre.gradient} p-[2px] rounded-xl overflow-hidden shadow-lg transform transition-all`}
              >
                <div className="relative h-32 w-48 rounded-xl bg-gray-900/90 backdrop-blur-sm p-4 group">
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    initial={{ y: 0 }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="p-3 rounded-full bg-gray-800/50 backdrop-blur-sm"
                    >
                      <genre.icon className="h-8 w-8" />
                    </motion.div>
                    <span className="text-center font-semibold group-hover:text-white transition-colors">
                      {genre.name}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {isExpanded && selectedGenre && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative mt-8 rounded-xl bg-gray-800/50 backdrop-blur-lg p-6 overflow-hidden"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-between mb-6"
            >
              <h3 className="text-xl font-semibold">
                Top {selectedGenre.name} Movies
              </h3>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="rounded-full p-2 hover:bg-gray-700/50 transition-colors"
              >
                <X className="h-6 w-6" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {genreMovies?.results?.slice(0, 8).map((movie, index) => (
                <MovieCard key={movie.id} movie={movie} index={index} />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} export default GenreTiles;
