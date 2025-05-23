
import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import BookCard from '../components/BookCard';
import UserCard from '../components/UserCard';
import { books as mockBooks, users as mockUsers } from '../data/mockData';
import { Book, BookUser, SearchFilters } from '../types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book as BookIcon, Users } from 'lucide-react';

const Index = () => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [users, setUsers] = useState<BookUser[]>(mockUsers);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    showAvailableOnly: false
  });
  
  // Apply filters to books
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Filter by availability if needed
      if (filters.showAvailableOnly && !book.isAvailable) {
        return false;
      }
      
      // Filter by search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [books, filters]);
  
  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
  };

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
        
        <Tabs defaultValue="books" className="mb-8">
          <TabsList className="bg-bookshelf-paper border border-bookshelf-brown/10">
            <TabsTrigger value="books" className="data-[state=active]:bg-bookshelf-teal data-[state=active]:text-white">
              <BookIcon className="w-4 h-4 mr-2" />
              Books
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-bookshelf-teal data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Readers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="books" className="pt-6">
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard 
                    key={book.id} 
                    book={book} 
                    owner={users.find(user => user.id === book.ownerId)!}
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
          </TabsContent>
          
          <TabsContent value="users" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {users.map((user) => (
                <UserCard key={user.id} user={user} books={books} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
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
          <p>© 2025 Neighborhood Bookshelf. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
