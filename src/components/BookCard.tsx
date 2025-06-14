
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  // Debug logging to see what data we're receiving
  console.log('BookCard received book data:', book);

  return (
    <div className="group bg-bookshelf-paper rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img 
          src={book.cover} 
          alt={`${book.title} cover`} 
          className="w-full h-64 object-cover book-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-bookshelf-dark truncate group-hover:text-bookshelf-teal transition-colors">{book.title}</h3>
        <p className="text-bookshelf-dark/70 text-sm">{book.author}</p>
        {book.ownerName ? (
          <p className="text-bookshelf-teal text-xs mt-1">by {book.ownerName}</p>
        ) : (
          <p className="text-bookshelf-dark/40 text-xs mt-1">Owner: Unknown</p>
        )}
      </div>
    </div>
  );
}
