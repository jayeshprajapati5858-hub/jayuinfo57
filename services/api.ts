
export const api = {
  checkHealth: async () => true,
  // Fixed: Added products parameter
  seedProducts: async (products: any) => true,
  getUsers: async () => [],
  createUser: async (user: any) => user,
  // Fixed: Added user parameter
  updateUser: async (user: any) => true,
  getProducts: async () => null,
  addProduct: async (p: any) => p,
  // Fixed: Added id and stock parameters
  updateStock: async (id: string, stock: number) => true,
  // Fixed: Added id parameter
  deleteProduct: async (id: string) => true,
  // Fixed: Added id and review parameters
  addReview: async (id: string, review: any) => true,
  getOrders: async () => [],
  createOrder: async (o: any) => o,
  // Fixed: Added id and status parameters
  updateOrderStatus: async (id: string, status: string) => true,
  getCoupons: async () => [],
  // Fixed: Added coupon parameter
  addCoupon: async (coupon: any) => true,
  // Fixed: Added code parameter
  deleteCoupon: async (code: string) => true,
  getAnnouncement: async () => null,
  // Fixed: Added ann parameter
  updateAnnouncement: async (ann: any) => true
};
