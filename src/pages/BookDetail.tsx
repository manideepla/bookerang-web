
import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BookIcon, ArrowLeft, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Book } from '../types';
import { getAuthHeaders } from '../services/api';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  // Get book data from navigation state
  const book = location.state?.book as Book;
  // Get the source page from navigation state, default to home
  const fromPage = location.state?.from || '/';
  
  // Check if we're coming from my books page
  const isFromMyBooks = fromPage === '/my-books';

  if (!book) {
    return (
      <div className="min-h-screen bg-bookshelf-cream/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-bookshelf-brown mb-4">Book Not Found</h2>
          <Button onClick={() => navigate(fromPage)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Button>
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    setIsRequesting(true);
    
    try {
      const response = await fetch(`http://localhost:8080/books/${book.id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (response.ok) {
        toast({
          title: 'Request Approved',
          description: `You have approved the borrow request for "${book.title}".`,
          variant: 'default'
        });
      } else {
        throw new Error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleReject = async () => {
    setIsRequesting(true);
    
    try {
      const response = await fetch(`http://localhost:8080/books/${book.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });

      if (response.ok) {
        toast({
          title: 'Request Rejected',
          description: `You have rejected the borrow request for "${book.title}".`,
          variant: 'default'
        });
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Rejection Failed',
        description: 'Failed to reject request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleBorrowRequest = async () => {
    setIsRequesting(true);
    
    try {
      const response = await fetch(`http://localhost:8080/books/${book.id}/borrow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
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
          onClick={() => navigate(fromPage)} 
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

                    {!isFromMyBooks && (
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
                    )}

                    <div className="flex items-center gap-3">
                      <span className="text-bookshelf-dark/70">Status:</span>
                      <Badge 
                        variant={book.state === 'Available' ? 'default' : 'secondary'}
                        className={book.state === 'Available' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                      >
                        {book.state || (book.isAvailable ? 'Available' : 'Not Available')}
                      </Badge>
                    </div>

                    {isFromMyBooks && book.state === 'Requested' ? (
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleApprove}
                          disabled={isRequesting}
                          className="flex-1 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          size="lg"
                        >
                          {isRequesting ? 'Processing...' : 'Approve'}
                        </Button>
                        <Button 
                          onClick={handleReject}
                          disabled={isRequesting}
                          className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          size="lg"
                        >
                          {isRequesting ? 'Processing...' : 'Reject'}
                        </Button>
                      </div>
                    ) : !isFromMyBooks && book.state === 'Available' ? (
                      <Button 
                        onClick={handleBorrowRequest}
                        disabled={isRequesting}
                        className="w-full bg-bookshelf-teal text-white hover:bg-bookshelf-teal/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                      >
                        {isRequesting ? 'Sending Request...' : 'Request to Borrow'}
                      </Button>
                    ) : null}
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
