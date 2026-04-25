import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getUsers = (token) => {
  return axios.get(`${API_URL}/users`, authHeader(token));
};

export const createUser = (payload, token) => {
  return axios.post(`${API_URL}/users`, payload, authHeader(token));
};

export const updateUser = (id, payload, token) => {
  return axios.patch(`${API_URL}/users/${id}`, payload, authHeader(token));
};

export const updateUserRole = (id, role, token) => {
  return axios.patch(
    `${API_URL}/users/${id}/role`,
    { role },
    authHeader(token),
  );
};

export const deleteUser = (id, token) => {
  return axios.delete(`${API_URL}/users/${id}`, authHeader(token));
};

export const getChatLogs = (token) => {
  return axios.get(`${API_URL}/chatlogs`, authHeader(token));
};

export const getChatLogDetail = (id, token) => {
  return axios.get(`${API_URL}/chatlogs/${id}`, authHeader(token));
};
