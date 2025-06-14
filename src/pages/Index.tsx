
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { books as mockBooks } from '../data/mockData';
import { Book, SearchFilters } from '../types';
import { fetchBooks } from '../services/api';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock' | 'none'>('none');
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    showAvailableOnly: false
  });
  const { toast } = useToast();
  
  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching books from API...');
        const booksData = await fetchBooks(3000);
        console.log('API response received:', booksData);
        console.log('Number of books received:', booksData?.length);
        
        if (Array.isArray(booksData) && booksData.length > 0) {
          console.log('Setting books state with API data');
          setAllBooks(booksData);
          setDisplayedBooks(booksData);
          setDataSource('api');
          toast({
            title: 'Connected to API',
            description: `Loaded ${booksData.length} books from the backend.`,
            variant: 'default'
          });
        } else {
          console.log('API returned empty data, using mock data');
          setAllBooks(mockBooks);
          setDisplayedBooks(mockBooks);
          setDataSource('mock');
          toast({
            title: 'No API Data',
            description: 'API returned no books. Using sample books for testing.',
            variant: 'default'
          });
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        console.log('Using mock data due to API error');
        setAllBooks(mockBooks);
        setDisplayedBooks(mockBooks);
        setDataSource('mock');
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to the backend. Using mock data instead.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);
  
  // Handle search by filtering the fetched books locally
  const handleSearch = (searchFilters: SearchFilters) => {
    console.log('=== SEARCH DEBUG ===');
    console.log('Search called with filters:', searchFilters);
    console.log('Total books available to search:', allBooks.length);
    console.log('Books data:', allBooks);
    
    setFilters(searchFilters);
    setHasSearched(true);
    
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
        const titleMatch = book.title.toLowerCase().includes(query);
        const authorMatch = book.author.toLowerCase().includes(query);
        const matches = titleMatch || authorMatch;
        console.log(`  - Query "${query}" matches: title=${titleMatch}, author=${authorMatch}, result=${matches}`);
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
    setFilters({ query: '', showAvailableOnly: false });
    setHasSearched(false);
    setDisplayedBooks(allBooks);
  };

  // Add debug logging for the books state
  useEffect(() => {
    console.log('Books state updated - All books:', allBooks.length, 'Displayed books:', displayedBooks.length);
  }, [allBooks, displayedBooks]);

  const shouldShowNoResults = hasSearched && displayedBooks.length === 0 && !isLoading;
  const shouldShowBooks = displayedBooks.length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-bookshelf-cream/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-bookshelf-brown mb-2">Discover Books Around You</h1>
          <p className="text-bookshelf-dark/70">
            Borrow books from neighbors and share your collection with the community
          </p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {/* Enhanced debug info */}
        <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>Data Source: <span className={`font-bold ${dataSource === 'api' ? 'text-green-600' : 'text-orange-600'}`}>{dataSource.toUpperCase()}</span></p>
          <p>Total books loaded: {allBooks.length}</p>
          <p>Currently displayed: {displayedBooks.length}</p>
          <p>Current search query: "{filters.query}"</p>
          <p>Available only filter: {filters.showAvailableOnly ? 'Yes' : 'No'}</p>
          <p>Has searched: {hasSearched ? 'Yes' : 'No'}</p>
          <p>Should show no results: {shouldShowNoResults ? 'Yes' : 'No'}</p>
          {dataSource === 'api' && <p className="text-green-600 mt-2">✅ Successfully connected to backend API</p>}
          {dataSource === 'mock' && <p className="text-orange-600 mt-2">⚠️ Using mock data (API not available or returned invalid data)</p>}
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
