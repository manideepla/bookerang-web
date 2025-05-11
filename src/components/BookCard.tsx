
import { Book, BookUser } from '../types';

interface BookCardProps {
  book: Book;
  owner: BookUser;
}

export default function BookCard({ book, owner }: BookCardProps) {
  return (
    <div className="group bg-bookshelf-paper rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={book.cover} 
          alt={`${book.title} cover`} 
          className="w-full h-64 object-cover book-cover"
        />
        <div 
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs text-white font-medium ${
            book.isAvailable ? 'bg-bookshelf-available' : 'bg-bookshelf-unavailable'
          }`}
        >
          {book.isAvailable ? 'Available' : 'Borrowed'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-bookshelf-dark truncate group-hover:text-bookshelf-teal transition-colors">{book.title}</h3>
        <p className="text-bookshelf-dark/70 text-sm">{book.author}</p>
        
        <div className="mt-4 pt-3 border-t border-bookshelf-brown/10 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src={owner.avatar} 
              alt={owner.name} 
              className="w-8 h-8 rounded-full object-cover border border-bookshelf-brown/20"
            />
            <span className="ml-2 text-xs text-bookshelf-dark">{owner.name}</span>
          </div>
          <span className="text-xs text-bookshelf-distance">{owner.distance}</span>
        </div>
      </div>
    </div>
  );
}
