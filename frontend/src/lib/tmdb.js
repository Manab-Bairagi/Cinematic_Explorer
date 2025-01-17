import axios from 'axios';

const FLASK_API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: FLASK_API_URL,
});

export const getImageUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const movieApi = {
  searchMovies: async (query, page = 1) => {
    const response = await api.get('/movies/search', {
      params: { query, page },
    });
    return response.data;
  },

  getMovieDetails: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  },

  getRecommendations: async (id, page = 1) => {
    const response = await api.get(`/movies/${id}/recommendations`, {
      params: { page },
    });
    return response.data;
  },

  getTrending: async () => {
    const response = await api.get('/movies/trending');
    return response.data;
  },

  getMoviesByGenre: async (genreId, page = 1) => {
    const response = await api.get(`/movies/discover/${genreId}`, {
      params: { page },
    });
    return response.data;
  },

  getMovieCast: async (id) => {
    // New method to fetch the cast of a movie
    const response = await api.get(`/movies/${id}/cast`);
    return response.data;
  },
};
