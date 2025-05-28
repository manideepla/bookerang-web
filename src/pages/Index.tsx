
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import { books as mockBooks } from '../data/mockData';
import { Book, SearchFilters } from '../types';
import { fetchBooks, searchBooks } from '../services/api';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [books, setBooks] = useState<Book[]>([]);
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
        
        if (booksData && booksData.length > 0) {
          console.log('Setting books state with API data');
          setBooks(booksData);
        } else {
          console.log('No books in API response, using mock data');
          setBooks(mockBooks);
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
        setBooks(mockBooks);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [toast]);
  
  // Handle search with API
  const handleSearch = async (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setIsLoading(true);
    
    try {
      const results = await searchBooks(
        searchFilters.query, 
        searchFilters.showAvailableOnly
      );
      setBooks(results);
    } catch (error) {
      console.error('Search failed:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to perform search. Please try again.',
        variant: 'destructive'
      });
      
      // Apply filters locally as fallback
      const filtered = mockBooks.filter(book => {
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
      
      setBooks(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug logging for the books state
  useEffect(() => {
    console.log('Books state updated:', books);
    console.log('Current number of books in state:', books.length);
  }, [books]);

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
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.map((book) => (
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
                onClick={() => setFilters({ query: '', showAvailableOnly: false })}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mt-12 text-center">
          <h2 className="text-2xl font-bold text-bookshelf-brown mb-4">Share Your Books</h2>
          <p className="text-bookshelf-dark/70 mb-6 max-w-2xl mx-auto">
            Join our community of readers and share your books with neighbors. 
            It's a great way to discover new titles and meet fellow book lovers.
          </p>
          <Button className="bg-bookshelf-brown hover:bg-bookshelf-brown/80 text-white">
            Add Your Books
          </Button>
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
