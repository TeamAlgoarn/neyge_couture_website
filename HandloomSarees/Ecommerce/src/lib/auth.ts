// import type { User } from '@/types';

// const STORAGE_KEY = 'handloom_user';

// export const authService = {
//   login: (email: string, _password: string): User | null => {
//     // Mock login - in real app, this would call an API
//     const mockUser: User = {
//       id: '1',
//       name: 'Priya Sharma',
//       email: email,
//       phone: '+91 98765 43210',
//       addresses: [
//         {
//           id: '1',
//           name: 'Priya Sharma',
//           phone: '+91 98765 43210',
//           addressLine1: '123 MG Road',
//           addressLine2: 'Near City Mall',
//           city: 'Bangalore',
//           state: 'Karnataka',
//           pincode: '560001',
//           isDefault: true,
//         },
//       ],
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
//     return mockUser;
//   },

//   register: (name: string, email: string, _password: string): User => {
//     const newUser: User = {
//       id: Date.now().toString(),
//       name,
//       email,
//       addresses: [],
//     };
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
//     return newUser;
//   },

//   logout: (): void => {
//     localStorage.removeItem(STORAGE_KEY);
//   },

//   getCurrentUser: (): User | null => {
//     const userStr = localStorage.getItem(STORAGE_KEY);
//     return userStr ? JSON.parse(userStr) : null;
//   },

//   updateUser: (user: User): void => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
//   },
// };



//below code is for actual API integration, replace the above mock implementation with this when ready to connect to backend

import api from "@/api/client";
import { tokenStorage } from "@/lib/token";
import type { User } from "@/types";

const USER_STORAGE_KEY = "handloom_user";

type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    user: {
      id: string;
      email: string;
      full_name?: string;
      name?: string;
      phone?: string;
      role?: string;
    };
  };
};

type MeResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    email: string;
    full_name?: string;
    name?: string;
    phone?: string;
    role?: string;
  };
};

function mapBackendUserToFrontendUser(user: {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  phone?: string;
  role?: string;
}): User {
  return {
    id: user.id,
    name: user.full_name || user.name || "",
    email: user.email,
    phone: user.phone || "",
    role: user.role,
    addresses: [],
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    const res = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    const token = res.data?.data?.access_token;
    const userData = res.data?.data?.user;

    if (!token || !userData) {
      return null;
    }

    tokenStorage.set(token);

    const mappedUser = mapBackendUserToFrontendUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));

    return mappedUser;
  },

  register: async (
    name: string,
    email: string,
    password: string,
    phone: string
  ): Promise<User> => {
    const res = await api.post<LoginResponse>("/auth/register", {
      name,
      email,
      password,
      phone,
    });

    const token = res.data?.data?.access_token;
    const userData = res.data?.data?.user;

    if (!token || !userData) {
      throw new Error("Registration failed");
    }

    tokenStorage.set(token);

    const mappedUser = mapBackendUserToFrontendUser(userData);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));

    return mappedUser;
  },

  logout: (): void => {
    tokenStorage.remove();
    localStorage.removeItem(USER_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(USER_STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  fetchCurrentUser: async (): Promise<User | null> => {
    const token = tokenStorage.get();
    if (!token) return null;

    try {
      const res = await api.get<MeResponse>("/auth/me");
      const mappedUser = mapBackendUserToFrontendUser(res.data.data);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mappedUser));
      return mappedUser;
    } catch {
      tokenStorage.remove();
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  },

  updateUser: (user: User): void => {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },
};