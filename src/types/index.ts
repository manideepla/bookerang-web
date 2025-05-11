
export interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  isAvailable: boolean;
  ownerId: number;
}

export interface BookUser {
  id: number;
  name: string;
  avatar: string;
  distance: string;
  books: number[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface SearchFilters {
  query: string;
  showAvailableOnly: boolean;
}
