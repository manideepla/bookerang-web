
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import AddBookForm from '../components/AddBookForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Plus } from 'lucide-react';
import { fetchUserBooks } from '../services/api';
import { Book as BookType } from '../types';

const MyBooks = () => {
  const [userBooks, setUserBooks] = useState<BookType[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));
  const [showAddBookForm, setShowAddBookForm] = useState(false);
  const { toast } = useToast();

  const loadUserBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const books = await fetchUserBooks();
      setUserBooks(books);
    } catch (error) {
      console.error('Failed to load user books:', error);
      toast({
        title: "Error",
        description: "Failed to load your books.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const handleAddBookSuccess = () => {
    loadUserBooks(); // Refresh the books list
  };

  // Enhanced auth state monitoring
  useEffect(() => {
    const checkAuthStatus = () => {
      const newAuthState = !!localStorage.getItem('auth_token');
      console.log('Auth state check in MyBooks:', newAuthState);
      setIsLoggedIn(newAuthState);
      
      // Clear user books when logged out
      if (!newAuthState) {
        setUserBooks([]);
        setShowAddBookForm(false);
      }
    };

    // Check on component mount
    checkAuthStatus();

    // Listen for storage changes (when auth token is added/removed)
    window.addEventListener('storage', checkAuthStatus);

    // Listen for custom auth events
    window.addEventListener('authStateChange', checkAuthStatus);

    // Also listen for beforeunload to catch any auth changes
    const handleBeforeUnload = () => {
      checkAuthStatus();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChange', checkAuthStatus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadUserBooks();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-bookshelf-cream/30">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-bookshelf-brown mb-4">My Books</h1>
            <p className="text-bookshelf-dark/70 mb-6">
              Please sign in to view your books.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bookshelf-cream/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-bookshelf-brown">My Books ({userBooks.length})</h1>
            <Button 
              className="bg-bookshelf-brown hover:bg-bookshelf-brown/80 text-white"
              onClick={() => setShowAddBookForm(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Book
            </Button>
          </div>
          
          {isLoadingBooks ? (
            <div className="text-center py-12">
              <div className="animate-pulse text-bookshelf-teal text-lg">Loading your books...</div>
            </div>
          ) : userBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent className="pt-6">
                <Book className="mx-auto h-16 w-16 text-bookshelf-dark/30 mb-6" />
                <h2 className="text-xl font-semibold text-bookshelf-brown mb-4">
                  No books yet
                </h2>
                <p className="text-bookshelf-dark/70 mb-6 max-w-md mx-auto">
                  Start building your personal library by adding your first book. Share books with your community and discover new reads!
                </p>
                <Button 
                  className="bg-bookshelf-brown hover:bg-bookshelf-brown/80 text-white"
                  onClick={() => setShowAddBookForm(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Book
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <AddBookForm 
        open={showAddBookForm}
        onOpenChange={setShowAddBookForm}
        onSuccess={handleAddBookSuccess}
      />
    </div>
  );
};

export default MyBooks;
