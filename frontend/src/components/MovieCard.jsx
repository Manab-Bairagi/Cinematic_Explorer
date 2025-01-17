import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatDate } from '../lib/utils';
import { getImageUrl } from '../lib/tmdb';

export function MovieCard({ movie, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg bg-gray-900 shadow-xl transition-transform hover:scale-105"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="aspect-[2/3] w-full">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <h3 className="text-lg font-bold">{movie.title}</h3>
            <p className="text-sm text-gray-300">{formatDate(movie.release_date)}</p>
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="text-sm">{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} export default MovieCard;