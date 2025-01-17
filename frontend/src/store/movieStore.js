import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMovieStore = create(
  persist(
    (set) => ({
      recentSearches: [],
      addRecentSearch: (search) =>
        set((state) => ({
          recentSearches: [
            search,
            ...state.recentSearches.filter((s) => s !== search),
          ].slice(0, 5),
        })),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'movie-store',
    }
  )
);