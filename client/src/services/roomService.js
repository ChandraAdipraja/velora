import axios from "axios";

const API_URL = "http://localhost:5000/api/rooms";

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

/*
USER / PUBLIC
*/
export const getAllRooms = () => {
  return axios.get(API_URL);
};

export const getGroupedRooms = async () => {
  const response = await axios.get(`${API_URL}/grouped/by-type`);
  return response.data;
};

export const getRoomDetailByType = async (roomType) => {
  const response = await axios.get(`${API_URL}/type/${roomType}`);
  return response.data;
};

/*
ADMIN
*/
export const createRoom = (payload, token) => {
  return axios.post(API_URL, payload, authHeader(token));
};

export const updateRoom = (id, payload, token) => {
  return axios.patch(`${API_URL}/${id}`, payload, authHeader(token));
};

export const deleteRoom = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, authHeader(token));
};
