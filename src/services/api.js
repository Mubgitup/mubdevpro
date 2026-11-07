/**
 * Mubdev Portfolio - Centralized API Service Layer
 * 
 * Manages all HTTP communication between the React frontend and the PHP backend.
 * Provides typed methods, authentication token attachment, and unified error handling.
 */

const API_BASE = '/api';

/**
 * Universal JSON fetch helper with authentication and error formatting.
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('mubdev_token');
  
  const headers = {
    'Accept': 'application/json',
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      let errorMessage = data.message;
      if (data.errors && data.errors.exception && typeof data.errors.exception === 'string') {
        errorMessage = `${data.message} (${data.errors.exception})`;
      }

      if (!errorMessage) {
        if (response.status === 500) {
          errorMessage = 'Backend Server Error (500): The PHP backend encountered an internal error. Please verify MySQL in XAMPP is active and PHP server is running.';
        } else if (response.status === 502 || response.status === 504) {
          errorMessage = 'Gateway Error: Vite proxy cannot reach the PHP API at http://127.0.0.1:8000. Please start the PHP server with: php -S 127.0.0.1:8000 -t backend backend/index.php';
        } else if (response.status === 404) {
          errorMessage = `API Endpoint not found (404): ${endpoint}`;
        } else {
          errorMessage = `Request failed with status ${response.status}`;
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.errors = data.errors || null;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    // Distinguish offline network failure vs HTTP error response
    if (!err.status) {
      err.isNetworkError = true;
      err.message = 'Unable to reach the backend API server. Please ensure PHP is running at http://127.0.0.1:8000 (run: php -S 127.0.0.1:8000 -t backend backend/index.php).';
    }
    throw err;
  }
}

export const api = {
  // System Diagnostics
  health: {
    check: () => request('/health')
  },

  // Public Contact Form
  contact: {
    submit: (formData) => request('/contact', {
      method: 'POST',
      body: formData
    })
  },

  // Administrative Authentication
  auth: {
    login: async (credentials) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: credentials
      });
      if (res.data?.token) {
        localStorage.setItem('mubdev_token', res.data.token);
      }
      return res;
    },
    logout: async () => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        localStorage.removeItem('mubdev_token');
      }
    },
    me: () => request('/auth/me')
  },

  // Administrative Message Management
  messages: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/messages${query ? `?${query}` : ''}`);
    },
    markRead: (id, isRead = true) => request(`/messages/${id}`, {
      method: 'PATCH',
      body: { is_read: isRead }
    }),
    delete: (id) => request(`/messages/${id}`, {
      method: 'DELETE'
    })
  }
};

export default api;

