
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
          className={`w-full h-64 bg-gradient-to-br from-bookshelf-brown/10 to-bookshelf-teal/10 border-2 border-dashed border-bookshelf-brown/20 flex items-center justify-center ${hasValidCover ? 'hidden' : 'flex'}`}
          style={hasValidCover ? { display: 'none' } : { display: 'flex' }}
        >
          <Book className="w-20 h-20 text-bookshelf-brown/30" />
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
      </div>
    </div>
  );
}
