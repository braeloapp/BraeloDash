// Api/methods.jsx
import axios from 'axios';
import { extractResultsList } from '@/lib/apiResponse';
import { getApiBaseUrl } from '@/lib/apiConfig';
import { cachedGet, invalidateGetCache } from '@/lib/apiCache';

/** No client timeout — Azure / cold starts must not abort mid-request. */
const api = axios.create({
  timeout: 0,
});

/**
 * Axios drops a relative baseURL when `url` starts with `/`.
 * Build the final URL from getApiBaseUrl() + endpoint
 * (absolute Azure/local origin, or `/api-backend` when proxy is enabled).
 */
function resolveUrl(endpoint) {
  const base = (getApiBaseUrl() || "").replace(/\/$/, "");
  const path = String(endpoint || "").startsWith("/")
    ? String(endpoint)
    : `/${endpoint}`;
  if (!base) return path;
  if (/^https?:\/\//i.test(base)) return `${base}${path}`;
  return `${base}${path}`;
}

function withBase(config = {}) {
  return { ...config };
}

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

function bustListCaches(endpoint = '') {
  const path = String(endpoint);
  if (path.includes('/admin-panel/')) {
    invalidateGetCache('/admin-panel/');
  }
  if (path.includes('/admin-panel/delete') || path.includes('flip/status')) {
    invalidateGetCache('/listing/paginate');
  }
}

export const LoginApi = async (endpoint, data) => {
  try {
    const response = await api.post(resolveUrl(endpoint), data, withBase());
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

export const getData = async (endpoint, options = {}) => {
  try {
    return await cachedGet(
      endpoint,
      async () => {
        const response = await api.get(resolveUrl(endpoint), withBase({
          headers: jsonHeaders(),
        }));
        return response.data;
      },
      {
        ttlMs: options.ttlMs ?? 25_000,
        bypass: Boolean(options.bypass),
      }
    );
  } catch (error) {
    console.error('GET Error:', error);
    throw error;
  }
};

export const postData = async (endpoint, data, config = {}) => {
  try {
    const response = await api.post(resolveUrl(endpoint), data, withBase({
      ...config,
      headers: requestHeaders(data, config.headers),
    }));
    bustListCaches(endpoint);
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

export const updateData = async (endpoint, data, config = {}) => {
  try {
    const response = await api.put(resolveUrl(endpoint), data, withBase({
      ...config,
      headers: requestHeaders(data, config.headers),
    }));
    bustListCaches(endpoint);
    return response.data;
  } catch (error) {
    console.error('PUT Error:', error);
    throw error;
  }
};

export const deleteData = async (endpoint, data, config = {}) => {
  try {
    const response = await api.delete(resolveUrl(endpoint), withBase({
      ...config,
      headers: requestHeaders(data, config.headers),
      data,
    }));
    bustListCaches(endpoint);
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
    const response = await api.put(resolveUrl(endpoint), data, withBase({
      ...config,
      headers,
    }));
    bustListCaches(endpoint);
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
    const response = await api.post(resolveUrl(endpoint), data, withBase({
      ...config,
      headers,
    }));
    bustListCaches(endpoint);
    return response.data;
  } catch (error) {
    console.error('POST Error:', error);
    throw error;
  }
};

/** GET without auth — used where the API returns a public list (e.g. business banners). */
export const getBanData = async (endpoint) => {
  try {
    const response = await api.get(resolveUrl(endpoint), withBase());
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
