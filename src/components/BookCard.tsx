
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  hideOwnerName?: boolean;
}

export default function BookCard({ book, hideOwnerName = false }: BookCardProps) {
  // Debug logging to see what data we're receiving
  console.log('BookCard received book data:', book);

  // Check if cover exists and is a valid URL
  const hasValidCover = book.cover && book.cover !== '/placeholder.svg' && book.cover.trim() !== '';

  return (
    <div className="group bg-bookshelf-paper rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        {hasValidCover ? (
          <img 
            src={book.cover} 
            alt={`${book.title} cover`} 
            className="w-full h-64 object-cover book-cover"
            onError={(e) => {
              console.log('Image failed to load:', book.cover);
              // Hide the broken image and show placeholder
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) {
                placeholder.style.display = 'flex';
              }
            }}
          />
        ) : null}
        
        {/* Placeholder for books without covers or failed image loads */}
        <div 
          className={`w-full h-64 bg-gradient-to-br from-bookshelf-brown/20 to-bookshelf-teal/20 flex flex-col items-center justify-center text-bookshelf-brown ${hasValidCover ? 'hidden' : 'flex'}`}
          style={hasValidCover ? { display: 'none' } : { display: 'flex' }}
        >
          <div className="text-6xl mb-4">📚</div>
          <div className="text-center px-4">
            <div className="font-semibold text-sm line-clamp-2">{book.title}</div>
            <div className="text-xs text-bookshelf-brown/70 mt-1">{book.author}</div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-bookshelf-dark truncate group-hover:text-bookshelf-teal transition-colors">{book.title}</h3>
        <p className="text-bookshelf-dark/70 text-sm">{book.author}</p>
        {!hideOwnerName && (
          <>
            {book.ownerName ? (
              <p className="text-bookshelf-teal text-xs mt-1">by {book.ownerName}</p>
            ) : (
              <p className="text-bookshelf-dark/40 text-xs mt-1">Owner: Unknown</p>
            )}
          </>
        )}
        {book.distance && (
          <p className="text-bookshelf-dark/50 text-xs mt-1">{book.distance}</p>
        )}
      </div>
    </div>
  );
}
