import type { UserDTO } from '../models/User';

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
}
