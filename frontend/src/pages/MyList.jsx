import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useMovieStore } from '../store/movieStore';
import { movieApi } from '../lib/tmdb';
import { MovieCard } from '../components/MovieCard';
import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

export function MyList() {
  const { recentSearches } = useMovieStore();

  const { data: recommendedMovies } = useQuery({
    queryKey: ['recommendations', recentSearches],
    queryFn: async () => {
      if (recentSearches.length === 0) return { results: [] };
      
      // Get movies based on recent searches
      const searchResults = await Promise.all(
        recentSearches.map(query => movieApi.searchMovies(query))
      );
      
      // Get first movie from each search to get recommendations
      const recommendations = await Promise.all(
        searchResults
          .map(result => result.results[0]?.id)
          .filter(Boolean)
          .map(movieId => movieApi.getRecommendations(movieId))
      );
      
      // Combine and deduplicate recommendations
      const allMovies = recommendations.flatMap(r => r.results);
      const uniqueMovies = Array.from(
        new Map(allMovies.map(movie => [movie.id, movie])).values()
      );
      
      return { results: uniqueMovies };
    },
    enabled: recentSearches.length > 0,
  });

  // Only keep the last 36 movies
  const moviesToDisplay = recommendedMovies?.results.slice(-36) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="mb-8 text-4xl font-bold">My List</h1>
        
        {recentSearches.length > 0 ? (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Recent Searches</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <motion.span
                  key={search}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300"
                >
                  {search}
                </motion.span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-400">
            Your search history will appear here. Start searching for movies to get personalized recommendations!
          </p>
        )}

        {moviesToDisplay.length > 0 && (
          <>
            <h2 className="mb-6 text-2xl font-semibold">Recommended for You</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {moviesToDisplay.map((movie, index) => (
                <MovieCardWithScrollAnimation key={movie.id} movie={movie} index={index} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

// Individual Movie Card with Scroll Animation
function MovieCardWithScrollAnimation({ movie }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Check if the movie card is in view
  const handleScroll = () => {
    const top = ref.current?.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.8 && !isInView) {
      setIsInView(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check if in view on load

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{
        duration: 0.6,
        ease: 'easeOut',
      }}
    >
      <MovieCard movie={movie} />
    </motion.div>
  );
}

export default MyList;
