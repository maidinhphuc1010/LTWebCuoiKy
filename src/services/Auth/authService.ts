// src/services/authService.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';  // Replace with your API URL

// Login service
export const login = (identifier: string, password: string) => {
  return axios.post(`${API_URL}/login`, { identifier, password });
};

// Change password service
export const changePassword = (values: { currentPassword: string; newPassword: string }) => {
  return axios.put(`${API_URL}/change-password`, values, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};

// Forgot password service
export const forgotPassword = (email: string) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

// Reset password service
export const resetPassword = (values: { token: string; newPassword: string }) => {
  return axios.post(`${API_URL}/reset-password`, values);
};
