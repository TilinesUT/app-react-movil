import type { UserDTO } from '../models/User';
import type { ProductDTO } from '../models/Product';

export class ApiService {
  private static instance: ApiService;
  private readonly baseUrl = 'https://fakestoreapi.com';

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async getUsers(): Promise<UserDTO[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    if (!response.ok) {
      throw new Error(`Error al obtener usuarios: ${response.status}`);
    }
    return response.json() as Promise<UserDTO[]>;
  }

  async login(username: string, password: string): Promise<UserDTO> {
    const users = await this.getUsers();
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      throw new Error('Credenciales incorrectas');
    }
    return user;
  }

  async getProducts(): Promise<ProductDTO[]> {
    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }
    return response.json() as Promise<ProductDTO[]>;
  }

  async getCategories(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/products/categories`);
    if (!response.ok) {
      throw new Error(`Error al obtener categorias: ${response.status}`);
    }
    return response.json() as Promise<string[]>;
  }

  async getProductsByCategory(category: string): Promise<ProductDTO[]> {
    const response = await fetch(
      `${this.baseUrl}/products/category/${encodeURIComponent(category)}`
    );
    if (!response.ok) {
      throw new Error(`Error al filtrar productos: ${response.status}`);
    }
    return response.json() as Promise<ProductDTO[]>;
  }

  async getProduct(id: number): Promise<ProductDTO> {
    const response = await fetch(`${this.baseUrl}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener producto: ${response.status}`);
    }
    return response.json() as Promise<ProductDTO>;
  }

  async deleteProduct(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar producto: ${response.status}`);
    }
  }

  async updateProduct(
    id: number,
    payload: {
      title: string;
      price: number;
      description: string;
      category: string;
      image: string;
    }
  ): Promise<ProductDTO> {
    const response = await fetch(`${this.baseUrl}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Error al actualizar producto: ${response.status}`);
    }
    return response.json() as Promise<ProductDTO>;
  }
}
