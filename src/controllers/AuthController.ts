import type { UserDTO } from '../models/User';
import { ApiService } from '../services/ApiService';
import { Session } from '../models/Session';
import { User } from '../models/User';

export class AuthController {
  private static instance: AuthController;
  private api: ApiService;
  private session: Session;

  private constructor() {
    this.api = ApiService.getInstance();
    this.session = Session.getInstance();
  }

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  get currentUser(): User | null {
    return this.session.user;
  }

  get isAuthenticated(): boolean {
    return this.session.isAuthenticated;
  }

  async login(username: string, password: string): Promise<User> {
    const dto: UserDTO = await this.api.login(username, password);
    const user = new User(dto);
    this.session.save(user);
    return user;
  }

  logout(): void {
    this.session.destroy();
  }

  restoreSession(): User | null {
    return this.session.load();
  }
}
