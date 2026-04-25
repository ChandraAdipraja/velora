import axios from "axios";

const API_URL = "http://localhost:5000/api/reservations";

/*
USER
- create reservation
- get my reservations
- get reservation detail / receipt
- upload payment proof
*/
export const createReservation = async (payload, token) => {
  const response = await axios.post(API_URL, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyReservations = async (token) => {
  const response = await axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getReservationDetail = async (id, token) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const uploadPaymentProof = async (id, payload, token) => {
  const response = await axios.post(`${API_URL}/${id}/payment-proof`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

/*
PENGURUS / ADMIN
- get all reservations
- verify payment
- reject payment
- update reservation status
*/
export const getAllReservationsForStaff = async (token) => {
  const response = await axios.get(`${API_URL}/staff/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const verifyPayment = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/verify-payment`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const rejectPayment = async (id, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/reject-payment`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const updateReservationStatus = async (id, status, token) => {
  const response = await axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
