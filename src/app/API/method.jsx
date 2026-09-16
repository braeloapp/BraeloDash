// Api/methods.jsx
import axios from 'axios';
import { extractResultsList } from '@/lib/apiResponse';
import { getApiBaseUrl } from '@/lib/apiConfig';

const API_BASE_URL = getApiBaseUrl();

function authToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/** JSON requests — never force Content-Type onto FormData. */
function jsonHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${authToken()}`,
  };
}

/** Auth-only headers; axios sets multipart boundary for FormData. */
function authOnlyHeaders(extra = {}) {
  const headers = {
    Authorization: `Bearer ${authToken()}`,
    ...extra,
  };
  return headers;
}

function requestHeaders(data, extra = {}) {
  if (data instanceof FormData) {
    const headers = authOnlyHeaders(extra);
    // Let the browser/axios set multipart boundary
    delete headers['Content-Type'];
    return headers;
  }
  return { ...jsonHeaders(), ...extra };
}

export const LoginApi = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: jsonHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('GET Error:', error);
    throw error;
  }
};

export const postData = async (endpoint, data, config = {}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers: requestHeaders(data, config.headers),
    });
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

export const updateData = async (endpoint, data, config = {}) => {
  try {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers: requestHeaders(data, config.headers),
    });
    return response.data;
  } catch (error) {
    console.error('PUT Error:', error);
    throw error;
  }
};

export const deleteData = async (endpoint, data, config = {}) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      ...config,
      headers: requestHeaders(data, config.headers),
      data,
    });
    return response.data;
  } catch (error) {
    console.error('DELETE Error:', error);
    throw error;
  }
};

export const updateListData = async (endpoint, data, config = {}) => {
  try {
    const headers = authOnlyHeaders(config.headers);
    if (data instanceof FormData) {
      delete headers['Content-Type'];
    } else if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('PUT Error:', error);
    throw error;
  }
};

export const postBusiData = async (endpoint, data, config = {}) => {
  try {
    const headers = authOnlyHeaders(config.headers);
    // Let axios set multipart boundary when sending FormData
    if (data instanceof FormData) {
      delete headers['Content-Type'];
    } else if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      ...config,
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
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
      error: null,
    };
  } catch (error) {
    console.error('GET Error:', error);
    return {
      data: null,
      status: error.response?.status || 500,
      error: error.response?.data?.message || error.message,
    };
  }
};
