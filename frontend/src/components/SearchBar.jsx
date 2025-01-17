import { Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMovieStore } from '../store/movieStore';
import { debounce } from '../lib/utils';

export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const { addRecentSearch } = useMovieStore();

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = debounce(async () => {
      try {
        const response = await fetch(
          `/api/movies/suggestions?query=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json(); // No need to access .suggestions
          setSuggestions(data); // Set suggestions directly since it's an array
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);

    fetchSuggestions();

    return () => {
      fetchSuggestions.cancel && fetchSuggestions.cancel();
    };
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
      addRecentSearch(query);
      setSuggestions([]); // Clear suggestions after searching
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]); // Clear suggestions when a suggestion is selected
    onSearch(suggestion);
    addRecentSearch(suggestion);
  };

  return (
    <div className="flex justify-center items-center w-full py-8">
      <div className="relative w-full max-w-xl">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for movies..."
              className={`w-full rounded-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 ${query.trim() && 'bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700'}`}
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-lg bg-gray-800 text-white shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-700"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:from-purple-500 hover:to-blue-500 active:from-blue-500 active:to-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
