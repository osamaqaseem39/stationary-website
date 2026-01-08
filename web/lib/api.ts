const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://stationary-server-alpha.vercel.app/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ProductsResponse {
  products: any[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductDetailResponse {
  product: any;
  variants: any[];
}

export interface CategoriesResponse {
  categories: any[];
}

class ApiClient {
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

  async register(name: string, email: string, password: string) {
    const result = await this.request<{ user: any; accessToken: string; refreshToken: string }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
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
    return this.request<ProductsResponse>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request<ProductDetailResponse>(`/products/${id}`);
  }

  // Categories
  async getCategories(parentId?: string) {
    const query = parentId ? `?parentId=${parentId}` : '';
    return this.request<CategoriesResponse>(`/categories${query}`);
  }

  // Orders
  async createOrder(orderData: any) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }

  // Addresses
  async getAddresses() {
    return this.request('/users/addresses');
  }

  async createAddress(addressData: any) {
    return this.request('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

