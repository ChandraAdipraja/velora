import axios from "axios";

const API_URL = "http://localhost:5000/api/rooms";

export const getGroupedRooms = async () => {
  const response = await axios.get(`${API_URL}/grouped/by-type`);
  return response.data;
};

export const getRoomDetailByType = async (roomType) => {
  const response = await axios.get(`${API_URL}/type/${roomType}`);
  return response.data;
};
