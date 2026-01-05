
import { Product, Order, Coupon, Review } from '../types';

// Pointing to the VPS backend server
// IMPORTANT: If your website is loaded via HTTPS, this HTTP URL might be blocked by browsers (Mixed Content).
const API_URL = 'http://152.53.240.143:5000/api'; 

// Helper to handle API errors with timeout support
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = 5000) => {
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
  // Check Connection with a short 3s timeout
  checkHealth: async () => {
    try {
      const res = await fetchWithTimeout(`${API_URL}/health`, {}, 3000);
      return res.ok;
    } catch (e) {
      console.warn("VPS Health check failed (Check if your Node.js server is running on port 5000):", e);
      return false;
    }
  },

  // --- Products ---
  getProducts: async (): Promise<Product[]> => {
    const res = await fetchWithTimeout(`${API_URL}/products`);
    return handleResponse(res);
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

  // --- Orders ---
  getOrders: async (): Promise<Order[]> => {
    const res = await fetchWithTimeout(`${API_URL}/orders`);
    return handleResponse(res);
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
