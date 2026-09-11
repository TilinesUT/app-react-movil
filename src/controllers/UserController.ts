import { Role } from '../models/Role';
import { User } from '../models/User';
import { ApiService } from '../services/ApiService';

export class UserController {
  private static instance: UserController;
  private api: ApiService;

  private constructor() {
    this.api = ApiService.getInstance();
  }

  static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  async getAllUsers(): Promise<User[]> {
    const dtos = await this.api.getUsers();
    return dtos.map((dto) => new User(dto));
  }

  getRoleLabel(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'Administrador';
      case Role.AUDITOR:
        return 'Auditor';
      case Role.CLIENT:
        return 'Cliente';
    }
  }

  getRoleColor(role: Role): string {
    switch (role) {
      case Role.ADMIN:
        return 'bg-red-100 text-red-800';
      case Role.AUDITOR:
        return 'bg-yellow-100 text-yellow-800';
      case Role.CLIENT:
        return 'bg-green-100 text-green-800';
    }
  }
}
