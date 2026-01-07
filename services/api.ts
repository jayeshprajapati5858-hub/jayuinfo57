
import { Product, Order, Coupon, Review, User } from '../types';

// Default to the VPS IP, but try to fetch from LocalStorage if set by Admin
const DEFAULT_API_URL = 'http://152.53.240.143:5000/api'; 

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('mh_api_config_url');
    if (savedUrl) return savedUrl.replace(/\/$/, ""); // Remove trailing slash
  }
  return DEFAULT_API_URL;
};

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

/**
 * Enhanced fetch with diagnostic logging and silent error handling
 */
const fetchWithRetry = async (endpoint: string, options: RequestInit = {}, timeout = 5000) => {
  const baseUrl = getApiUrl();
  const url = `${baseUrl}${endpoint}`;

  if (isHttps && baseUrl.startsWith('http:')) {
    console.warn(`MIXED CONTENT WARNING: Your site is HTTPS but trying to connect to HTTP backend (${baseUrl}). This request will likely fail on Vercel. Please update API URL in Admin Settings to an HTTPS domain.`);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    console.error(`API Call Failed to ${url}:`, error.message);
    return { ok: false, statusText: error.message };
  }
};

const handleResponse = async (response: any) => {
  if (!response || response.ok === false) {
    return null;
  }
  try {
    return await response.json();
  } catch (e) {
    return null;
  }
};

export const api = {
  // Helper to get current URL for display
  getCurrentUrl: () => getApiUrl(),

  // Helper to set URL
  setApiUrl: (url: string) => {
    localStorage.setItem('mh_api_config_url', url);
    window.location.reload();
  },

  checkHealth: async () => {
    try {
      // We use a simple endpoint or just products to check if server is alive
      const res = await fetch(`${getApiUrl()}/products`, { method: 'HEAD', mode: 'cors' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // USER METHODS
  getUsers: async (): Promise<User[]> => {
    const res = await fetchWithRetry(`/users`);
    const data = await handleResponse(res);
    return data || [];
  },

  createUser: async (user: User): Promise<User | null> => {
    const res = await fetchWithRetry(`/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return await handleResponse(res);
  },

  // PRODUCT METHODS
  getProducts: async (): Promise<Product[] | null> => {
    const res = await fetchWithRetry(`/products`);
    return await handleResponse(res);
  },

  addProduct: async (product: Product): Promise<Product | null> => {
    const res = await fetchWithRetry(`/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return await handleResponse(res);
  },

  updateStock: async (id: string, stock: number): Promise<Product | null> => {
    const res = await fetchWithRetry(`/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    return await handleResponse(res);
  },

  // ORDER METHODS
  getOrders: async (): Promise<Order[]> => {
    const res = await fetchWithRetry(`/orders`);
    const data = await handleResponse(res);
    return data || [];
  },

  createOrder: async (order: Order): Promise<Order | null> => {
    const res = await fetchWithRetry(`/orders`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
    return await handleResponse(res);
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order | null> => {
    const res = await fetchWithRetry(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  },
};
