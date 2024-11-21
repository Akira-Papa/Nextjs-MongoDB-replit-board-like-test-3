import { v4 as uuidv4 } from 'uuid';

export interface User {
  userId: string;
  username: string;
}

export const getCurrentUser = (): User => {
  if (typeof window === 'undefined') {
    return null;
  }

  let userId = localStorage.getItem('userId');
  let username = localStorage.getItem('username');

  if (!userId || !username) {
    userId = `user_${uuidv4()}`;
    username = `ユーザー${userId.slice(-4)}`;
    
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
  }

  return { userId, username };
};

export const updateUsername = (newUsername: string): void => {
  if (typeof window === 'undefined' || !newUsername.trim()) {
    return;
  }

  localStorage.setItem('username', newUsername.trim());
};
