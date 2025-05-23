
import { Book, BookUser } from '../types';

const API_BASE_URL = 'http://localhost:8080';

// Store the authentication token
let authToken: string | null = null;

export const login = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "username": "cerseila",
        "password": "aliesrec"
      })
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    
    const data = await response.json();
    authToken = data.token;
    localStorage.setItem('auth_token', authToken);
    return authToken;
  } catch (error) {
    console.error('Login error:', error);
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

export const fetchBooks = async (distance: number = 3000): Promise<Book[]> => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/books?distance=${distance}`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`Error fetching books: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const fetchUsers = async (): Promise<BookUser[]> => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers
    });
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
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
    return await response.json();
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

export const logout = (): void => {
  authToken = null;
  localStorage.removeItem('auth_token');
};
