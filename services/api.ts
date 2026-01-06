
import { Product, Order, Coupon, Review, User } from '../types';

// Your VPS Backend IP
const API_URL = 'http://152.53.240.143:5000/api'; 

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

/**
 * Enhanced fetch with diagnostic logging and silent error handling
 */
const fetchWithRetry = async (url: string, options: RequestInit = {}, timeout = 5000) => {
  if (isHttps && url.startsWith('http:')) {
    // We log this as a warning instead of error to be less aggressive
    console.warn("MIXED CONTENT: Browser may block this HTTP call because the site is HTTPS.");
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
    // Return a failed response object instead of throwing
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
  checkHealth: async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { method: 'HEAD', mode: 'cors' });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  // USER METHODS
  getUsers: async (): Promise<User[]> => {
    const res = await fetchWithRetry(`${API_URL}/users`);
    const data = await handleResponse(res);
    return data || [];
  },

  createUser: async (user: User): Promise<User | null> => {
    const res = await fetchWithRetry(`${API_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
    });
    return await handleResponse(res);
  },

  // PRODUCT METHODS
  getProducts: async (): Promise<Product[] | null> => {
    const res = await fetchWithRetry(`${API_URL}/products`);
    return await handleResponse(res);
  },

  addProduct: async (product: Product): Promise<Product | null> => {
    const res = await fetchWithRetry(`${API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return await handleResponse(res);
  },

  updateStock: async (id: string, stock: number): Promise<Product | null> => {
    const res = await fetchWithRetry(`${API_URL}/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    return await handleResponse(res);
  },

  // ORDER METHODS
  getOrders: async (): Promise<Order[]> => {
    const res = await fetchWithRetry(`${API_URL}/orders`);
    const data = await handleResponse(res);
    return data || [];
  },

  createOrder: async (order: Order): Promise<Order | null> => {
    const res = await fetchWithRetry(`${API_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
    return await handleResponse(res);
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order | null> => {
    const res = await fetchWithRetry(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return await handleResponse(res);
  },
};
