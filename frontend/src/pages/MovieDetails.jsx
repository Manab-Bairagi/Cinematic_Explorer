import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Star } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { movieApi, getImageUrl } from '../lib/tmdb';
import { formatDate } from '../lib/utils';

export function MovieDetails() {
  const { id } = useParams();

  const { data: movie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieApi.getMovieDetails(id),
  });

  const { data: recommendations } = useQuery({
    queryKey: ['recommendations', id],
    queryFn: () => movieApi.getRecommendations(id),
    enabled: !!movie,
  });

  if (!movie) return null;

  return (
    <div className="min-h-screen">
      {/* Set the background as the movie poster in grayscale */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url(${getImageUrl(movie.poster_path, 'original')})`,
          filter: 'grayscale(100%)',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/80" />

      <div className="container mx-auto px-4 py-8">
        <Link
          to="/home"
          className="mb-8 inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Search
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-8 lg:grid-cols-[300px,1fr]"
        >
          <div
            className="aspect-[2/3] w-full overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
          >
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <span>•</span>
              <span>{formatDate(movie.release_date)}</span>
              <span>•</span>
              <span>{movie.runtime} min</span>
            </div>

            <p className="mb-6 text-lg text-gray-300">{movie.overview}</p>

            {movie.genres && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.cast && (
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-semibold">Cast</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {movie.cast.map((member) => (
                    <div
                      key={member.name}
                      className="flex flex-col items-center text-center"
                    >
                      <div className="aspect-square w-24 h-24 overflow-hidden rounded-full">
                        <img
                          src={getImageUrl(member.profile_path, 'w185')}
                          alt={member.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        as {member.character}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendations?.results?.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-semibold">You might also like</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {recommendations.results.slice(0, 4).map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link to={`/movie/${movie.id}`}>
                        <div className="aspect-[2/3] overflow-hidden rounded-lg transition-transform duration-300 hover:scale-110">
                          <img
                            src={getImageUrl(movie.poster_path)}
                            alt={movie.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default MovieDetails;
