const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = async ({ username, email, password }) => {
  const resp = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  return resp.json();
};

export const login = async ({ identifier, password }) => {
  const resp = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  return resp.json();
};

export const getProfile = async () => {
  const resp = await fetch(`${API_BASE}/auth/profile`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  });
  return resp.json();
};

export const createShortUrl = async (payload) => {
  const resp = await fetch(`${API_BASE}/url/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(payload)
  });
  return resp.json();
};

export const getUrlBySlug = async (slug) => {
  const resp = await fetch(`${API_BASE}/url/analytics/${slug}`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  });
  return resp.json();
};

export const getMyUrls = async () => {
  const resp = await fetch(`${API_BASE}/url/me`, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    }
  });
  return resp.json();
};
