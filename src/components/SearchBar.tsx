
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SearchFilters } from '../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  filters?: SearchFilters;
}

export default function SearchBar({ onSearch, filters }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  
  // Reset form when filters are cleared externally
  useEffect(() => {
    if (filters) {
      setQuery(filters.query);
      setShowAvailableOnly(filters.showAvailableOnly);
    }
  }, [filters]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ query, showAvailableOnly });
  };
  
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    
    // Auto-search when query is empty (cleared)
    if (newQuery === '') {
      onSearch({ query: '', showAvailableOnly });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-bookshelf-dark/40" />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={query}
              onChange={handleQueryChange}
              className="w-full pl-10 pr-4 py-2 border border-bookshelf-teal/30 rounded-md focus:outline-none focus:ring-2 focus:ring-bookshelf-teal"
            />
          </div>
          <button
            type="submit"
            className="bg-bookshelf-teal text-white px-4 py-2 rounded-md hover:bg-bookshelf-teal/80 transition-colors"
          >
            Search
          </button>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="availableOnly"
            checked={showAvailableOnly}
            onChange={(e) => setShowAvailableOnly(e.target.checked)}
            className="rounded text-bookshelf-teal focus:ring-bookshelf-teal"
          />
          <label htmlFor="availableOnly" className="ml-2 text-bookshelf-dark">
            Show available books only
          </label>
        </div>
      </form>
    </div>
  );
}
