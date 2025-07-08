
import { Book } from 'lucide-react';

interface BookPlaceholderProps {
  className?: string;
}

export function BookPlaceholder({ className = "" }: BookPlaceholderProps) {
  return (
    <div className={`w-full h-64 bg-gradient-to-br from-bookshelf-brown/10 to-bookshelf-teal/10 border-2 border-dashed border-bookshelf-brown/20 flex items-center justify-center ${className}`}>
      <Book className="w-20 h-20 text-bookshelf-brown/30" />
    </div>
  );
}
