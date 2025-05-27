
import { useState } from 'react';
import { Book, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '../services/api';
import { useToast } from '@/hooks/use-toast';
import SignInForm from './SignInForm';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));
  const [showSignInForm, setShowSignInForm] = useState(false);
  const { toast } = useToast();
  
  const handleSignInSuccess = () => {
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out.",
    });
  };
  
  return (
    <>
      <header className="bg-bookshelf-cream border-b border-bookshelf-brown/20 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-bookshelf-brown" />
            <h1 className="text-2xl font-bold text-bookshelf-brown">Bookerang</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-bookshelf-brown hover:text-bookshelf-teal transition-colors">Home</a>
            <a href="#" className="text-bookshelf-brown hover:text-bookshelf-teal transition-colors">My Books</a>
            <a href="#" className="text-bookshelf-brown hover:text-bookshelf-teal transition-colors">Profile</a>
            
            {isLoggedIn ? (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-bookshelf-cream border-bookshelf-brown/40 hover:bg-bookshelf-brown/10"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                className="bg-bookshelf-cream border-bookshelf-brown/40 hover:bg-bookshelf-brown/10"
                onClick={() => setShowSignInForm(true)}
              >
                Sign In
              </Button>
            )}
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-bookshelf-brown p-2"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-bookshelf-cream py-2 px-4">
            <nav className="flex flex-col space-y-3">
              <a href="#" className="text-bookshelf-brown hover:text-bookshelf-teal transition-colors py-2">Home</a>
              <a href="#" className="text-bookshelf-brown hover:text-bookshelf-teal transition-colors py-2">My Books</a>
              <a href="#" className="text-bookshelf-brown hover:text-bookshelf-teal transition-colors py-2">Profile</a>
              
              {isLoggedIn ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-bookshelf-cream border-bookshelf-brown/40 hover:bg-bookshelf-brown/10"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-bookshelf-cream border-bookshelf-brown/40 hover:bg-bookshelf-brown/10"
                  onClick={() => setShowSignInForm(true)}
                >
                  Sign In
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>
      
      <SignInForm 
        open={showSignInForm}
        onOpenChange={setShowSignInForm}
        onSuccess={handleSignInSuccess}
      />
    </>
  );
}
