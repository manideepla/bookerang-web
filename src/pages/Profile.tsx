import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MapPin, User, LogOut, Edit2, Check, X } from 'lucide-react';
import { logout, fetchUserProfile } from '../services/api';

const Profile = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('auth_token'));
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState('');
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const { toast } = useToast();

  // Listen for auth token changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const newAuthStatus = !!localStorage.getItem('auth_token');
      setIsLoggedIn(newAuthStatus);
      
      // If user just logged in, load their profile
      if (newAuthStatus && !userProfile) {
        loadUserProfile();
      }
      // If user logged out, clear profile
      if (!newAuthStatus) {
        setUserProfile(null);
      }
    };

    // Check on component mount
    checkAuthStatus();

    // Listen for storage changes (when auth token is added/removed)
    window.addEventListener('storage', checkAuthStatus);

    // Listen for custom auth events
    window.addEventListener('authStateChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authStateChange', checkAuthStatus);
    };
  }, [userProfile]);

  const loadUserProfile = async () => {
    if (!isLoggedIn) return;
    
    setIsLoadingProfile(true);
    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
      setPhoneValue(profile?.phoneNumber || '');
    } catch (error) {
      console.error('Failed to load user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleEditPhone = () => {
    setIsEditingPhone(true);
    setPhoneValue(userProfile?.phoneNumber || '');
  };

  const handleCancelPhoneEdit = () => {
    setIsEditingPhone(false);
    setPhoneValue(userProfile?.phoneNumber || '');
  };

  const handleSavePhone = async () => {
    setIsUpdatingPhone(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/user/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ phoneNumber: phoneValue }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        setIsEditingPhone(false);
        toast({
          title: "Success",
          description: "Phone number updated successfully.",
        });
      } else {
        throw new Error('Failed to update phone number');
      }
    } catch (error) {
      console.error('Failed to update phone number:', error);
      toast({
        title: "Error",
        description: "Failed to update phone number.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingPhone(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
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
    setUserProfile(null);
    // Dispatch custom event to notify Header component
    window.dispatchEvent(new Event('authStateChange'));
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  useEffect(() => {
    // Auto-get location on component mount if user is logged in
    if (isLoggedIn) {
      getCurrentLocation();
      loadUserProfile();
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

  const formatMemberSince = (dateString: string) => {
    if (!dateString) return 'Today';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Today';
    }
  };

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
                {isLoadingProfile ? (
                  <div className="space-y-4">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-bookshelf-dark/70">Username</label>
                      <p className="text-bookshelf-brown font-medium">
                        {userProfile?.username || localStorage.getItem('username') || 'Guest User'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-bookshelf-dark/70">Member since</label>
                      <p className="text-bookshelf-brown font-medium">
                        {formatMemberSince(userProfile?.createdAt || userProfile?.memberSince)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-bookshelf-dark/70">Phone Number</label>
                      {isEditingPhone ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            value={phoneValue}
                            onChange={(e) => setPhoneValue(e.target.value)}
                            placeholder="Enter phone number"
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            onClick={handleSavePhone}
                            disabled={isUpdatingPhone}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelPhoneEdit}
                            disabled={isUpdatingPhone}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                           <p className="text-bookshelf-brown font-medium flex-1">
                             {userProfile?.phoneNumber || 'No phone number set'}
                           </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditPhone}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  
                  <p className="text-sm text-bookshelf-dark/70">
                    Your location helps us show you books available nearby.
                  </p>
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
