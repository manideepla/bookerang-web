
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookIcon, ArrowLeft, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '../types';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  // Get book data from navigation state
  const book = location.state?.book as Book;

  if (!book) {
    return (
      <div className="min-h-screen bg-bookshelf-cream/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bookshelf-brown mb-4">Book Not Found</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBorrowRequest = async () => {
    setIsRequesting(true);
    
    try {
      // This would be replaced with actual API call
      const response = await fetch(`http://localhost:8080/books/${book.id}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: book.id,
          message: 'I would like to borrow this book'
        })
      });

      if (response.ok) {
        toast({
          title: 'Borrow Request Sent',
          description: `Your request to borrow "${book.title}" has been sent to ${book.ownerName}.`,
          variant: 'default'
        });
      } else {
        throw new Error('Failed to send borrow request');
      }
    } catch (error) {
      console.error('Error sending borrow request:', error);
      toast({
        title: 'Request Failed',
        description: 'Failed to send borrow request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const hasValidCover = book.cover && book.cover !== '/placeholder.svg' && book.cover.trim() !== '';

  return (
    <div className="min-h-screen bg-bookshelf-cream/30">
      <div className="container mx-auto px-4 py-8">
        <Button 
          onClick={() => navigate('/')} 
          variant="outline" 
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Books
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Book Cover */}
                <div className="relative">
                  {hasValidCover ? (
                    <img 
                      src={book.cover} 
                      alt={`${book.title} cover`}
                      className="w-full h-96 md:h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-96 md:h-full bg-gradient-to-br from-bookshelf-brown/10 to-bookshelf-teal/10 border-2 border-dashed border-bookshelf-brown/20 flex items-center justify-center">
                      <BookIcon className="w-24 h-24 text-bookshelf-brown/30" />
                    </div>
                  )}
                </div>

                {/* Book Details */}
                <div className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold text-bookshelf-dark mb-2">
                        {book.title}
                      </h1>
                      <p className="text-xl text-bookshelf-dark/70 mb-4">
                        by {book.author}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-bookshelf-dark/70">
                        <User className="w-5 h-5" />
                        <span>Owner: {book.ownerName}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-bookshelf-dark/70">
                        <MapPin className="w-5 h-5" />
                        <span>{book.distance} away</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${book.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className={`font-medium ${book.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                        {book.isAvailable ? 'Available' : 'Not Available'}
                      </span>
                    </div>

                    {book.isAvailable && (
                      <Button 
                        onClick={handleBorrowRequest}
                        disabled={isRequesting}
                        className="w-full bg-bookshelf-teal text-white hover:bg-bookshelf-teal/80"
                        size="lg"
                      >
                        {isRequesting ? 'Sending Request...' : 'Request to Borrow'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
