// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth
export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// User
export const getUser = async (userId) => {
  const response = await api.get(`/user/${userId}`);
  return response.data;
};

export const getUserStats = async (userId) => {
  const response = await api.get(`/user/${userId}/stats`);
  return response.data;
};

// Habits
export const getHabits = async (userId) => {
  const response = await api.get(`/habits?userId=${userId}`);
  return response.data;
};

export const createHabit = async (habitData) => {
  const response = await api.post("/habits", habitData);
  return response.data;
};

export const updateHabit = async (habitId, userId, updateData) => {
  const response = await api.patch(`/habits/${habitId}`, {
    userId,
    ...updateData,
  });
  return response.data;
};

export const deleteHabit = async (habitId, userId) => {
  const response = await api.delete(`/habits/${habitId}?userId=${userId}`);
  return response.data;
};

// Completions
export const getTodayCompletions = async (userId) => {
  const response = await api.get(`/completions/today?userId=${userId}`);
  return response.data;
};

export const incrementCompletion = async (habitId, userId) => {
  const response = await api.post("/completions/increment", {
    habitId,
    userId,
  });
  return response.data;
};

export const decrementCompletion = async (habitId, userId) => {
  const response = await api.post("/completions/decrement", {
    habitId,
    userId,
  });
  return response.data;
};

export default api;
