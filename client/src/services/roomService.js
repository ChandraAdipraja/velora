import axios from "axios";

const API_URL = "http://localhost:5000/api/rooms";

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// USER / PUBLIC
export const getAllRooms = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getGroupedRooms = async () => {
  const response = await axios.get(`${API_URL}/grouped/by-type`);
  return response.data;
};

export const getRoomDetailByType = async (roomType) => {
  const response = await axios.get(`${API_URL}/type/${roomType}`);
  return response.data;
};

// ADMIN
export const createRoom = async (payload, token) => {
  const response = await axios.post(API_URL, payload, authHeader(token));
  return response.data;
};

export const updateRoom = async (id, payload, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    payload,
    authHeader(token),
  );
  return response.data;
};

export const deleteRoom = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader(token));
  return response.data;
};
