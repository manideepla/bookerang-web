
import { Book, BookUser } from '../types';

const API_BASE_URL = 'http://localhost:8080';

export const fetchBooks = async (distance: number = 3000): Promise<Book[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books?distance=${distance}`);
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
    const response = await fetch(`${API_BASE_URL}/users`);
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
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (showAvailableOnly) params.append('available', 'true');
    
    const response = await fetch(`${API_BASE_URL}/books/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Error searching books: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};
