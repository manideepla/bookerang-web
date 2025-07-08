
import { Book } from 'lucide-react';

interface BookPlaceholderProps {
  title: string;
  author: string;
  className?: string;
}

export function BookPlaceholder({ title, author, className = "" }: BookPlaceholderProps) {
  return (
    <div className={`w-full h-64 bg-gradient-to-br from-bookshelf-brown/10 to-bookshelf-teal/10 border-2 border-dashed border-bookshelf-brown/20 flex flex-col items-center justify-center text-bookshelf-brown ${className}`}>
      <Book className="w-16 h-16 mb-4 text-bookshelf-brown/40" />
      <div className="text-center px-4">
        <div className="font-semibold text-sm line-clamp-2 text-bookshelf-brown/80">{title}</div>
        <div className="text-xs text-bookshelf-brown/60 mt-1">{author}</div>
      </div>
    </div>
  );
}
