
import { Product, Order, Coupon, Review } from '../types';

// Pointing to the VPS backend server
const API_URL = 'http://152.53.240.143:5000/api'; 

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

// Helper to handle API errors with timeout support
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 3000) => {
  // If we are on HTTPS and trying to call HTTP, browser will block it. 
  // Return a rejection early to trigger fallback.
  if (isHttps && url.startsWith('http:')) {
    console.warn("Mixed Content: Blocking HTTP API call on HTTPS site.");
    throw new Error("Mixed Content Blocked");
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
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `API Request Failed with status ${response.status}`);
  }
  return response.json();
};

export const api = {
  checkHealth: async () => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/health`, {}, 2000);
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/products`);
      return await handleResponse(res);
    } catch (e) {
      console.warn("Could not fetch products from server, using local data.");
      throw e;
    }
  },

  addProduct: async (product: Product): Promise<Product> => {
    const res = await fetchWithTimeout(`${API_URL}/products`, {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return handleResponse(res);
  },

  updateStock: async (id: string, stock: number): Promise<Product> => {
    const res = await fetchWithTimeout(`${API_URL}/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
    return handleResponse(res);
  },

  addReview: async (productId: string, review: Review): Promise<Product> => {
    const res = await fetchWithTimeout(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
    return handleResponse(res);
  },

  deleteProduct: async (id: string): Promise<void> => {
    const res = await fetchWithTimeout(`${API_URL}/products/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/orders`);
      return await handleResponse(res);
    } catch (e) {
      return [];
    }
  },

  createOrder: async (order: Order): Promise<Order> => {
    const res = await fetchWithTimeout(`${API_URL}/orders`, {
      method: 'POST',
      body: JSON.stringify(order),
    });
    return handleResponse(res);
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const res = await fetchWithTimeout(`${API_URL}/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },
};
