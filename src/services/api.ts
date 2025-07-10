
import { Book } from '../types';

const API_BASE_URL = 'http://localhost:8080';

// Store the authentication token
let authToken: string | null = null;

export const login = async (username: string, password: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    
    const data = await response.json();
    authToken = data.token;
    localStorage.setItem('auth_token', authToken);
    localStorage.setItem('username', username);
    return authToken;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signup = async (username: string, password: string, firstName: string, lastName: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password,
        firstName,
        lastName
      })
    });
    
    if (!response.ok) {
      throw new Error(`Sign up failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
};

export const getAuthHeaders = (): HeadersInit => {
  // Try to get token from memory or local storage
  if (!authToken) {
    authToken = localStorage.getItem('auth_token');
  }
  
  return authToken 
    ? { 'Authorization': `Bearer ${authToken}` } 
    : {};
};

export const fetchUserProfile = async (): Promise<any> => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`Error fetching user profile: ${response.status}`);
    }
    const data = await response.json();
    console.log('User profile data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const fetchNearbyBooks = async (radius: number = 3000): Promise<Book[]> => {
  try {
    console.log('🔍 Starting fetchNearbyBooks API call...');
    console.log('🔗 API URL:', `${API_BASE_URL}/books/nearby?radius=${radius}`);
    
    const headers = getAuthHeaders();
    console.log('🔑 Request headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/books/nearby?radius=${radius}`, {
      headers
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('❌ API response not ok:', response.status, response.statusText);
      throw new Error(`Error fetching nearby books: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Raw API response:', data);
    console.log('📦 Response type:', typeof data);
    console.log('📦 Is array:', Array.isArray(data));
    
    // Handle both direct array and object with books property
    let books: any[] = [];
    if (Array.isArray(data)) {
      books = data;
      console.log('✅ Using direct array format');
    } else if (data && Array.isArray(data.books)) {
      books = data.books;
      console.log('✅ Using object.books format');
    } else {
      console.warn('⚠️ Unexpected API response format:', data);
      return [];
    }
    
    console.log('📚 Number of books before mapping:', books.length);
    
    // Map the books to match the Book interface
    const mappedBooks = books.map((book: any, index: number) => {
      console.log(`📖 Processing book ${index + 1}:`, {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        cover: book.cover,
        isAvailable: book.isAvailable,
        ownerName: book.username || book.ownerName || book.owner_name || book.firstName || book.lastName || book.user?.username || book.user?.firstName || book.user?.lastName
      });
      
      // Try multiple possible owner name fields
      let ownerName = 'Unknown Owner';
      if (book.username) ownerName = book.username;
      else if (book.ownerName) ownerName = book.ownerName;
      else if (book.owner_name) ownerName = book.owner_name;
      else if (book.firstName && book.lastName) ownerName = `${book.firstName} ${book.lastName}`;
      else if (book.firstName) ownerName = book.firstName;
      else if (book.lastName) ownerName = book.lastName;
      else if (book.user?.username) ownerName = book.user.username;
      else if (book.user?.firstName && book.user?.lastName) ownerName = `${book.user.firstName} ${book.user.lastName}`;
      else if (book.user?.firstName) ownerName = book.user.firstName;
      else if (book.user?.lastName) ownerName = book.user.lastName;
      else if (book.owner?.name) ownerName = book.owner.name;
      else if (book.owner?.username) ownerName = book.owner.username;
      else if (book.owner?.firstName && book.owner?.lastName) ownerName = `${book.owner.firstName} ${book.owner.lastName}`;
      
      console.log(`📝 Final owner name for book "${book.title}": "${ownerName}"`);
      
      return {
        id: book.id || 0,
        title: book.title || 'Unknown Title',
        author: book.author || 'Unknown Author',
        cover: book.coverUrl || book.cover || '/placeholder.svg',
        isAvailable: book.isAvailable !== undefined ? book.isAvailable : true,
        ownerId: book.ownerId || book.owner_id || book.userId || book.user_id || 0,
        ownerName: ownerName,
        distance: book.distance || 'Unknown distance'
      };
    });
    
    console.log('✅ Final mapped books:', mappedBooks.length);
    console.log('📋 Book titles with owners:', mappedBooks.map(b => `"${b.title}" by ${b.ownerName}`));
    
    return mappedBooks;
  } catch (error) {
    console.error('💥 fetchNearbyBooks error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('💥 Is this a network error?', error instanceof TypeError);
    console.error('💥 Error fetching nearby books:', error);
    return [];
  }
};

export const fetchBooks = async (radius: number = 3000): Promise<Book[]> => {
  try {
    console.log('🔍 Starting fetchBooks API call...');
    console.log('🔗 API URL:', `${API_BASE_URL}/books?radius=${radius}`);
    
    const headers = getAuthHeaders();
    console.log('🔑 Request headers:', headers);
    
    const response = await fetch(`${API_BASE_URL}/books?radius=${radius}`, {
      headers
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    
    if (!response.ok) {
      console.error('❌ API response not ok:', response.status, response.statusText);
      throw new Error(`Error fetching books: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Raw API response:', data);
    console.log('📦 Response type:', typeof data);
    console.log('📦 Is array:', Array.isArray(data));
    
    // Handle both direct array and object with books property
    let books: any[] = [];
    if (Array.isArray(data)) {
      books = data;
      console.log('✅ Using direct array format');
    } else if (data && Array.isArray(data.books)) {
      books = data.books;
      console.log('✅ Using object.books format');
    } else {
      console.warn('⚠️ Unexpected API response format:', data);
      return [];
    }
    
    console.log('📚 Number of books before mapping:', books.length);
    
    // Map the books to match the Book interface
    const mappedBooks = books.map((book: any, index: number) => {
      console.log(`📖 Processing book ${index + 1}:`, {
        id: book.id,
        title: book.title,
        author: book.author,
        coverUrl: book.coverUrl,
        cover: book.cover,
        isAvailable: book.isAvailable,
        ownerName: book.username || book.ownerName || book.owner_name
      });
      
      return {
        id: book.id || 0,
        title: book.title || 'Unknown Title',
        author: book.author || 'Unknown Author',
        cover: book.coverUrl || book.cover || '/placeholder.svg',
        isAvailable: book.isAvailable !== undefined ? book.isAvailable : true,
        ownerId: book.ownerId || book.owner_id || 0,
        ownerName: book.username || book.ownerName || book.owner_name || book.owner?.name || 'Unknown Owner',
        distance: book.distance || 'Unknown distance'
      };
    });
    
    console.log('✅ Final mapped books:', mappedBooks.length);
    console.log('📋 Book titles:', mappedBooks.map(b => b.title));
    
    return mappedBooks;
  } catch (error) {
    console.error('💥 fetchBooks error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    console.error('💥 Is this a network error?', error instanceof TypeError);
    console.error('💥 Error fetching books:', error);
    return [];
  }
};

export const searchBooks = async (query: string, showAvailableOnly: boolean): Promise<Book[]> => {
  try {
    const headers = getAuthHeaders();
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (showAvailableOnly) params.append('available', 'true');
    
    const response = await fetch(`${API_BASE_URL}/books/search?${params.toString()}`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`Error searching books: ${response.status}`);
    }
    const data = await response.json();
    
    // Handle both direct array and object with books property
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.books)) {
      return data.books;
    } else {
      console.warn('Unexpected search response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const fetchUserBooks = async (): Promise<Book[]> => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/books`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`Error fetching user books: ${response.status}`);
    }
    const data = await response.json();
    console.log('Raw user books API response:', data);
    
    // Handle both direct array and object with books property
    let books: any[] = [];
    if (Array.isArray(data)) {
      books = data;
    } else if (data && Array.isArray(data.books)) {
      books = data.books;
    } else {
      console.warn('Unexpected user books response format:', data);
      return [];
    }
    
    // Map the books to match the Book interface, using coverUrl from API
    const mappedBooks = books.map((book: any) => ({
      id: book.id || 0,
      title: book.title || 'Unknown Title',
      author: book.author || 'Unknown Author',
      cover: book.coverUrl || book.cover || '/placeholder.svg',
      isAvailable: book.isAvailable !== undefined ? book.isAvailable : true,
      ownerId: book.ownerId || book.owner_id || 0,
      ownerName: book.username || book.ownerName || book.owner_name || book.owner?.name || 'Unknown Owner',
      distance: book.distance || 'Unknown distance'
    }));
    
    return mappedBooks;
  } catch (error) {
    console.error('Error fetching user books:', error);
    return [];
  }
};

export const addBook = async (title: string, author: string, bookPhoto?: File): Promise<Book> => {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    
    if (bookPhoto) {
      formData.append('newBook', bookPhoto);
    }

    const headers = {
      ...getAuthHeaders(),
      // Don't set Content-Type header when using FormData, let the browser set it
    };
    
    const response = await fetch(`${API_BASE_URL}/books/add`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Error adding book: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Book added successfully:', data);
    
    // Return the book with the coverUrl from the response
    return {
      id: data.id || 0,
      title: title,
      author: author,
      cover: data.coverUrl || '/placeholder.svg',
      isAvailable: true,
      ownerId: 0,
      ownerName: 'You',
      distance: 'Your book'
    };
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
};

export const logout = (): void => {
  authToken = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('username');
};
