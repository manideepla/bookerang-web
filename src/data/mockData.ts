
import { BookUser } from '../types';

export const users: BookUser[] = [
  {
    id: 1,
    name: "Emma Thompson",
    avatar: "https://i.pravatar.cc/150?img=1",
    distance: "0.5 miles away",
    books: [1, 3, 8],
    location: { lat: 40.712, lng: -74.006 },
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=11",
    distance: "0.8 miles away",
    books: [2, 6],
    location: { lat: 40.715, lng: -74.009 },
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=5",
    distance: "1.2 miles away",
    books: [4, 5, 9],
    location: { lat: 40.718, lng: -74.003 },
  },
  {
    id: 4,
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?img=12",
    distance: "1.5 miles away",
    books: [7, 10],
    location: { lat: 40.710, lng: -74.001 },
  },
];
