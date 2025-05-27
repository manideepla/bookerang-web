
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, User, Book, LogOut } from 'lucide-react';
import { logout } from '../services/api';

const Profile = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
        setIsGettingLocation(false);
        toast({
          title: "Location Updated",
          description: "Your location has been successfully updated.",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = 'Unable to retrieve your location.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setLocationError(errorMessage);
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  useEffect(() => {
    // Auto-get location on component mount if user is logged in
    if (isLoggedIn) {
      getCurrentLocation();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-bookshelf-cream/30">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-bookshelf-brown mb-4">Profile</h1>
            <p className="text-bookshelf-dark/70 mb-6">
              Please sign in to view your profile.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bookshelf-cream/30">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-bookshelf-brown mb-8">My Profile</h1>
          
          <div className="space-y-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-bookshelf-dark/70">Username</label>
                    <p className="text-bookshelf-brown font-medium">
                      {localStorage.getItem('username') || 'Not available'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-bookshelf-dark/70">Member since</label>
                    <p className="text-bookshelf-brown font-medium">Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  Location Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {location ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-green-800 font-medium">Location detected:</p>
                      <p className="text-green-700 text-sm">
                        Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-gray-700">No location set</p>
                    </div>
                  )}
                  
                  {locationError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 text-sm">{locationError}</p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="bg-bookshelf-teal hover:bg-bookshelf-teal/80"
                  >
                    {isGettingLocation ? 'Getting Location...' : 'Update Location'}
                  </Button>
                  
                  <p className="text-sm text-bookshelf-dark/70">
                    Your location helps us show you books available nearby.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* My Books Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Book className="mr-2 h-5 w-5" />
                  My Books
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Book className="mx-auto h-12 w-12 text-bookshelf-dark/30 mb-4" />
                  <p className="text-bookshelf-dark/70 mb-4">
                    You haven't added any books yet.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-bookshelf-brown text-bookshelf-brown hover:bg-bookshelf-brown/10"
                  >
                    Add Your First Book
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive"
                  onClick={handleLogout}
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
