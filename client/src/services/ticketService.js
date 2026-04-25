import axios from "axios";

const API_URL = "http://localhost:5000/api/tickets";

/*
USER
*/
export const getMyTickets = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/*
STAFF
*/
export const getOpenTickets = async (token) => {
  const response = await axios.get(`${API_URL}/queue`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyAssignedTickets = async (token) => {
  const response = await axios.get(`${API_URL}/my-assigned`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const takeTicket = async (ticketId, token) => {
  const response = await axios.patch(
    `${API_URL}/${ticketId}/take`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

/*
MESSAGES
*/
export const getTicketMessages = async (ticketId, token) => {
  const response = await axios.get(`${API_URL}/${ticketId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const sendMessage = async (ticketId, message, token) => {
  const response = await axios.post(
    `${API_URL}/${ticketId}/messages`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const getTicketDetail = async (ticketId, token) => {
  const response = await axios.get(`${API_URL}/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
