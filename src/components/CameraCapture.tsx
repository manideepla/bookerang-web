
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Camera, X, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (imageFile: File) => void;
}

export default function CameraCapture({ open, onOpenChange, onCapture }: CameraCaptureProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check your permissions.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  const confirmPhoto = useCallback(() => {
    if (capturedImage && canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'book-photo.jpg', { type: 'image/jpeg' });
          onCapture(file);
          setCapturedImage(null);
          onOpenChange(false);
        }
      }, 'image/jpeg', 0.8);
    }
  }, [capturedImage, onCapture, onOpenChange]);

  const handleClose = useCallback(() => {
    stopCamera();
    setCapturedImage(null);
    onOpenChange(false);
  }, [stopCamera, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Take a Photo of Your Book</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isStreaming && !capturedImage && (
            <div className="text-center py-8">
              <Camera className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Click below to start your camera</p>
              <Button onClick={startCamera} className="bg-bookshelf-brown hover:bg-bookshelf-brown/80">
                <Camera className="mr-2 h-4 w-4" />
                Start Camera
              </Button>
            </div>
          )}
          
          {isStreaming && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={capturePhoto}
                  className="flex-1 bg-bookshelf-brown hover:bg-bookshelf-brown/80"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Capture
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {capturedImage && (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured book"
                  className="w-full rounded-lg"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={confirmPhoto}
                  className="flex-1 bg-bookshelf-brown hover:bg-bookshelf-brown/80"
                >
                  Use This Photo
                </Button>
                <Button variant="outline" onClick={retakePhoto}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </DialogContent>
    </Dialog>
  );
}
