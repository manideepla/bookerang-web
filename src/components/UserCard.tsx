
import { BookUser, Book } from '../types';

interface UserCardProps {
  user: BookUser;
  books: Book[];
}

export default function UserCard({ user, books }: UserCardProps) {
  const userBooks = books.filter(book => user.books.includes(book.id));
  const availableBooks = userBooks.filter(book => book.isAvailable).length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-300">
      <img 
        src={user.avatar} 
        alt={user.name} 
        className="w-16 h-16 rounded-full object-cover border-2 border-bookshelf-teal"
      />
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-bookshelf-dark">{user.name}</h3>
        <p className="text-bookshelf-distance text-sm">{user.distance}</p>
        
        <div className="mt-2">
          <p className="text-sm text-bookshelf-dark">
            <span className="font-medium">{userBooks.length}</span> Books · 
            <span className="text-bookshelf-available font-medium ml-1">{availableBooks} Available</span>
          </p>
          
          <div className="mt-2 flex -space-x-2 overflow-hidden">
            {userBooks.slice(0, 4).map((book) => (
              <div key={book.id} className="relative w-8 h-12 rounded overflow-hidden border border-bookshelf-brown/10">
                <img 
                  src={book.cover} 
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
                {!book.isAvailable && (
                  <div className="absolute inset-0 bg-black/30"></div>
                )}
              </div>
            ))}
            {userBooks.length > 4 && (
              <div className="relative w-8 h-12 flex items-center justify-center bg-bookshelf-cream rounded border border-bookshelf-brown/10">
                <span className="text-xs text-bookshelf-dark font-medium">+{userBooks.length - 4}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
