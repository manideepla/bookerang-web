
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
        
        // If fetchBooks returns an array (even if empty), use it
        // Only fall back to mock data if there was an actual error
        if (Array.isArray(booksData)) {
          console.log('Setting books state with API data');
          setAllBooks(booksData);
          setDisplayedBooks(booksData);
        } else {
          console.log('API did not return an array, using mock data');
          setAllBooks(mockBooks);
          setDisplayedBooks(mockBooks);
        }
      } catch (error) {
        console.error('Failed to load initial data:', error);
        console.log('Using mock data due to API error');
        toast({
          title: 'Connection Error',
          description: 'Failed to connect to the backend. Using mock data instead.',
          variant: 'destructive'
        });
        
        // Fallback to mock data if API fails
        setAllBooks(mockBooks);
        setDisplayedBooks(mockBooks);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);
  
  // Handle search by filtering the fetched books locally
  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    
    console.log('Searching locally within fetched books...');
    console.log('Search filters:', searchFilters);
    
    const filtered = allBooks.filter(book => {
      // Filter by availability if needed
      if (searchFilters.showAvailableOnly && !book.isAvailable) {
        return false;
      }
      
      // Filter by search query
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    console.log('Filtered results:', filtered.length, 'books');
    setDisplayedBooks(filtered);
  };

  // Clear filters function
  const handleClearFilters = () => {
    setFilters({ query: '', showAvailableOnly: false });
    setDisplayedBooks(allBooks);
  };

  // Add debug logging for the books state
  useEffect(() => {
    console.log('All books state:', allBooks.length);
    console.log('Displayed books state:', displayedBooks.length);
  }, [allBooks, displayedBooks]);

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
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-bookshelf-brown mb-6">Available Books</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-pulse text-bookshelf-teal">Loading books...</div>
            </div>
          ) : displayedBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedBooks.map((book) => (
                <BookCard 
                  key={book.id} 
                  book={book}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-bookshelf-dark/50 mb-4">No books found matching your search.</p>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
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
