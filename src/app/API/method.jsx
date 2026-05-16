// Api/methods.jsx
import axios from 'axios';
import { extractResultsList } from '@/lib/apiResponse';

const API_BASE_URL = 'https://braelo-v1-bdaqhdc4c7d9fdb7.canadacentral-01.azurewebsites.net';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "multipart/form-data",
    'Authorization': `Bearer ${token}`
  };
};

export const LoginApi = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
    });
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('GET Error:', error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('PUT Error:', error);
    throw error;
  }
};

 export const deleteData = async (endpoint, data) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      data: data
    });
    return response.data;
  } catch (error) {
    console.error('DELETE Error:', error);
    throw error;
  }
}

export const updateListData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      headers: getHeaders()
    });
    return response.data;
  } catch (error) {
    console.error('PUT Error:', error);
    throw error;
  }
};

export const postBusiData = async (endpoint, data, config = {}) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      ...(config.headers || {}),
    };
    // Let axios set multipart boundary when sending FormData
    if (!(data instanceof FormData)) {
      headers["Content-Type"] = headers["Content-Type"] ?? "multipart/form-data";
    }
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

/** GET without auth — used where the API returns a public list (e.g. business banners). */
export const getBanData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    const list = extractResultsList(response.data);
    return {
      data: list,
      status: response.status,
      error: null
    };
  } catch (error) {
    console.error('GET Error:', error);
    return {
      data: null,
      status: error.response?.status || 500,
      error: error.response?.data?.message || error.message
    };
  }
};