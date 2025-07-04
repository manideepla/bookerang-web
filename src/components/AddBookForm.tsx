
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addBook } from '../services/api';
import CameraCapture from './CameraCapture';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface AddBookFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddBookForm({ open, onOpenChange, onSuccess }: AddBookFormProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [bookPhoto, setBookPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePhotoCapture = (imageFile: File) => {
    setBookPhoto(imageFile);
    const previewUrl = URL.createObjectURL(imageFile);
    setPhotoPreview(previewUrl);
    toast({
      title: "Photo Captured!",
      description: "Your book photo has been added.",
    });
  };

  const removePhoto = () => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setBookPhoto(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both title and author.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await addBook(title.trim(), author.trim(), bookPhoto || undefined);
      
      toast({
        title: "Book Added!",
        description: bookPhoto 
          ? "Your book and photo have been added successfully."
          : "Your book has been added successfully.",
      });
      
      // Reset form
      setTitle('');
      setAuthor('');
      removePhoto();
      
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Add book error:', error);
      toast({
        title: "Failed to Add Book",
        description: "There was an error adding your book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter book title"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Enter author name"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label>Book Photo (Optional)</Label>
              <div className="mt-2 space-y-3">
                {photoPreview ? (
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Book preview"
                      className="w-full h-40 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removePhoto}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-3">
                      Take a photo to show how your copy looks
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCamera(true)}
                      disabled={isLoading}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex-1 bg-bookshelf-brown hover:bg-bookshelf-brown/80"
              >
                {isLoading ? 'Adding...' : 'Add Book'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <CameraCapture
        open={showCamera}
        onOpenChange={setShowCamera}
        onCapture={handlePhotoCapture}
      />
    </>
  );
}
