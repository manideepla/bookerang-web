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

export const fetchBooks = async (radius: number = 3000): Promise<Book[]> => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/books?radius=${radius}`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`Error fetching books: ${response.status}`);
    }
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Handle both direct array and object with books property
    let books: any[] = [];
    if (Array.isArray(data)) {
      books = data;
    } else if (data && Array.isArray(data.books)) {
      books = data.books;
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
    
    // Map the books to match the Book interface
    const mappedBooks = books.map((book: any) => ({
      id: book.id || 0,
      title: book.title || 'Unknown Title',
      author: book.author || 'Unknown Author',
      cover: book.cover || '/placeholder.svg', // Use placeholder if no cover
      isAvailable: book.isAvailable !== undefined ? book.isAvailable : true, // Default to available
      ownerId: book.ownerId || book.owner_id || 0,
      ownerName: book.username || book.ownerName || book.owner_name || book.owner?.name || 'Unknown Owner',
      distance: book.distance || 'Unknown distance'
    }));
    
    console.log('Books data structure check:', mappedBooks.map((book: any) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      ownerName: book.ownerName,
      cover: book.cover,
      isAvailable: book.isAvailable,
      distance: book.distance
    })));
    
    return mappedBooks;
  } catch (error) {
    console.error('Error fetching books:', error);
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
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.books)) {
      return data.books;
    } else {
      console.warn('Unexpected user books response format:', data);
      return [];
    }
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
      formData.append('photo', bookPhoto);
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
    return data;
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
