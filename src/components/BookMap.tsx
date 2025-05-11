
import { useMemo } from 'react';
import { MapPin, Book as BookIcon } from 'lucide-react';
import { Book, BookUser } from '../types';

interface BookMapProps {
  users: BookUser[];
  books: Book[];
}

export default function BookMap({ users, books }: BookMapProps) {
  // In a real app, we would use a proper map library like Google Maps or Leaflet
  // For this demo, we'll create a simple representation of the map
  
  // Calculate total available books per user
  const userAvailableBooks = useMemo(() => {
    return users.map(user => {
      const userBooks = books.filter(book => user.books.includes(book.id));
      const availableCount = userBooks.filter(book => book.isAvailable).length;
      return {
        ...user,
        availableCount
      };
    });
  }, [users, books]);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-bookshelf-teal text-white">
        <h2 className="text-lg font-semibold flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Books Near You
        </h2>
      </div>
      
      <div className="relative h-80 bg-[#e5e3df] p-4">
        {/* This is a simplified map representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-bookshelf-dark/50 text-sm italic">Interactive map would load here</p>
        </div>
        
        {/* Map markers */}
        {userAvailableBooks.map((user) => (
          <div
            key={user.id}
            className="map-marker absolute bg-white rounded-full p-2 shadow-md cursor-pointer"
            style={{
              left: `${(user.location.lng + 74.01) * 500}px`,
              top: `${(40.72 - user.location.lat) * 500}px`,
            }}
          >
            <div className="relative">
              <BookIcon className="h-5 w-5 text-bookshelf-teal" />
              {user.availableCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-bookshelf-available text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {user.availableCount}
                </span>
              )}
            </div>
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg text-xs whitespace-nowrap">
              {user.name} ({user.distance})
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <p className="text-sm text-bookshelf-dark/70">
          {books.filter(book => book.isAvailable).length} books available within 2 miles
        </p>
      </div>
    </div>
  );
}
