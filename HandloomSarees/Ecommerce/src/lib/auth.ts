import type { User } from '@/types';

const STORAGE_KEY = 'handloom_user';

export const authService = {
  login: (email: string, _password: string): User | null => {
    // Mock login - in real app, this would call an API
    const mockUser: User = {
      id: '1',
      name: 'Priya Sharma',
      email: email,
      phone: '+91 98765 43210',
      addresses: [
        {
          id: '1',
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          addressLine1: '123 MG Road',
          addressLine2: 'Near City Mall',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
        },
      ],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
  },

  register: (name: string, email: string, _password: string): User => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      addresses: [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  updateUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  },
};
