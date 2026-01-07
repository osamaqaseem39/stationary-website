const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class AdminApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Network error' };
    }
  }

  // Auth
  async login(email: string, password: string) {
    const result = await this.request<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
    if (result.data && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('refreshToken', result.data.refreshToken);
      this.token = result.data.accessToken;
    }
    return result;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      this.token = null;
    }
  }

  // Products
  async getProducts(params?: { categoryId?: string; search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params?.categoryId) query.append('categoryId', params.categoryId);
    if (params?.search) query.append('search', params.search);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    
    const queryString = query.toString();
    return this.request(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async createProduct(productData: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories
  async getCategories(parentId?: string) {
    const query = parentId ? `?parentId=${parentId}` : '';
    return this.request(`/categories${query}`);
  }

  async getCategory(id: string) {
    return this.request(`/categories/${id}`);
  }

  async createCategory(categoryData: any) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }

  // Orders
  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Inventory
  async getInventory(variantId?: string) {
    const query = variantId ? `?variantId=${variantId}` : '';
    return this.request(`/inventory${query}`);
  }

  async updateInventory(inventoryData: any) {
    return this.request('/inventory', {
      method: 'PUT',
      body: JSON.stringify(inventoryData),
    });
  }

  // Product Variants
  async getVariants(productId?: string) {
    const query = productId ? `?productId=${productId}` : '';
    return this.request(`/product-variants${query}`);
  }

  async createVariant(variantData: any) {
    return this.request('/product-variants', {
      method: 'POST',
      body: JSON.stringify(variantData),
    });
  }

  async updateVariant(id: string, variantData: any) {
    return this.request(`/product-variants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(variantData),
    });
  }

  // Users (assuming endpoints exist or will be created)
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const adminApiClient = new AdminApiClient(API_BASE_URL);

