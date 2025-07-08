
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import RadiusSelector from '../components/RadiusSelector';
import { Book, SearchFilters } from '../types';
import { fetchNearbyBooks } from '../services/api';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'none'>('none');
  const [hasSearched, setHasSearched] = useState(false);
  const [radius, setRadius] = useState(3000);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    showAvailableOnly: false
  });
  const { toast } = useToast();
  
  // Fetch books based on radius
  const loadBooks = async (searchRadius: number) => {
    setIsLoading(true);
    try {
      console.log('Fetching nearby books from API with radius:', searchRadius);
      const booksData = await fetchNearbyBooks(searchRadius);
      console.log('API response received:', booksData);
      console.log('Number of books received:', booksData?.length);
      
      if (Array.isArray(booksData) && booksData.length > 0) {
        console.log('Setting books state with API data');
        setAllBooks(booksData);
        setDisplayedBooks(booksData);
        setDataSource('api');
        toast({
          title: 'Books Updated',
          description: `Found ${booksData.length} books within ${searchRadius >= 1000 ? (searchRadius/1000).toFixed(1) + 'km' : searchRadius + 'm'}.`,
          variant: 'default'
        });
      } else {
        console.log('API returned empty data');
        setAllBooks([]);
        setDisplayedBooks([]);
        setDataSource('none');
        toast({
          title: 'No Books Found',
          description: `No books found within ${searchRadius >= 1000 ? (searchRadius/1000).toFixed(1) + 'km' : searchRadius + 'm'}.`,
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Failed to load data from API:', error);
      setAllBooks([]);
      setDisplayedBooks([]);
      setDataSource('none');
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to the backend.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadBooks(radius);
  }, []);

  // Handle radius change
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    loadBooks(newRadius);
  };
  
  // Handle search by filtering the fetched books locally
  const handleSearch = (searchFilters: SearchFilters) => {
    console.log('=== SEARCH DEBUG ===');
    console.log('Search called with filters:', searchFilters);
    console.log('Total books available to search:', allBooks.length);
    
    setFilters(searchFilters);
    setHasSearched(searchFilters.query !== '' || searchFilters.showAvailableOnly);
    
    const filtered = allBooks.filter(book => {
      console.log(`Checking book: "${book.title}" by ${book.author}`);
      
      // Filter by availability if needed
      if (searchFilters.showAvailableOnly && !book.isAvailable) {
        console.log(`  - Filtered out (not available)`);
        return false;
      }
      
      // Filter by search query
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        const bookTitle = String(book.title || '').toLowerCase();
        const bookAuthor = String(book.author || '').toLowerCase();
        const titleMatch = bookTitle.includes(query);
        const authorMatch = bookAuthor.includes(query);
        const matches = titleMatch || authorMatch;
        console.log(`  - Query "${query}" vs title "${bookTitle}" vs author "${bookAuthor}"`);
        console.log(`  - Matches: title=${titleMatch}, author=${authorMatch}, result=${matches}`);
        return matches;
      }
      
      console.log(`  - No query, including book`);
      return true;
    });
    
    console.log('Filtered results:', filtered.length, 'books');
    console.log('Filtered book titles:', filtered.map(book => book.title));
    console.log('=== END SEARCH DEBUG ===');
    
    setDisplayedBooks(filtered);
  };

  // Clear filters function
  const handleClearFilters = () => {
    console.log('Clearing filters, restoring all books:', allBooks.length);
    const clearedFilters = { query: '', showAvailableOnly: false };
    setFilters(clearedFilters);
    setHasSearched(false);
    setDisplayedBooks(allBooks);
  };

  // Add debug logging for the books state
  useEffect(() => {
    console.log('Books state updated - All books:', allBooks.length, 'Displayed books:', displayedBooks.length);
  }, [allBooks, displayedBooks]);

  const shouldShowNoResults = hasSearched && displayedBooks.length === 0 && !isLoading;
  const shouldShowBooks = displayedBooks.length > 0 && !isLoading;
  const shouldShowEmptyState = !isLoading && allBooks.length === 0 && !hasSearched;

  return (
    <div className="min-h-screen bg-bookshelf-cream/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-bookshelf-brown mb-2">Discover Books Around You</h1>
              <p className="text-bookshelf-dark/70">
                Borrow books from neighbors and share your collection with the community
              </p>
            </div>
            <RadiusSelector radius={radius} onRadiusChange={handleRadiusChange} />
          </div>
        </div>
        
        <SearchBar onSearch={handleSearch} filters={filters} />
        
        {/* Enhanced debug info */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Data Source: <span className={`font-bold ${dataSource === 'api' ? 'text-green-600' : 'text-red-600'}`}>{dataSource.toUpperCase()}</span></p>
          <p>Search radius: {radius >= 1000 ? (radius/1000).toFixed(1) + 'km' : radius + 'm'}</p>
          <p>Total books loaded: {allBooks.length}</p>
          <p>Currently displayed: {displayedBooks.length}</p>
          <p>Current search query: "{filters.query}"</p>
          <p>Available only filter: {filters.showAvailableOnly ? 'Yes' : 'No'}</p>
          <p>Has searched: {hasSearched ? 'Yes' : 'No'}</p>
          <p>Should show no results: {shouldShowNoResults ? 'Yes' : 'No'}</p>
          {dataSource === 'api' && <p className="text-green-600 mt-2">✅ Successfully connected to backend API</p>}
          {dataSource === 'none' && <p className="text-red-600 mt-2">❌ No data available from API</p>}
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-bookshelf-brown mb-6">Available Books</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-bookshelf-teal">Loading books...</div>
            </div>
          ) : shouldShowBooks ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                />
              ))}
            </div>
          ) : shouldShowNoResults ? (
            <div className="text-center py-12">
              <p className="text-bookshelf-dark/50 mb-4">No books found matching your search criteria.</p>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </div>
          ) : shouldShowEmptyState ? (
            <div className="text-center py-12">
              <p className="text-bookshelf-dark/50 mb-4">No books available from the backend.</p>
              <p className="text-bookshelf-dark/40 text-sm">Check your API connection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-bookshelf-cream border-t border-bookshelf-brown/20 mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-bookshelf-dark/70 text-sm">
          <p>© 2025 Bookerang. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
