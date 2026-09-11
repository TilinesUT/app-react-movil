import { User } from './User';

const SESSION_KEY = 'session_user';

export class Session {
  private static instance: Session;
  private _user: User | null = null;

  private constructor() {}

  static getInstance(): Session {
    if (!Session.instance) {
      Session.instance = new Session();
    }
    return Session.instance;
  }

  get user(): User | null {
    return this._user;
  }

  get isAuthenticated(): boolean {
    return this._user !== null;
  }

  save(user: User): void {
    this._user = user;
    const json = JSON.stringify(user.toJSON());
    document.cookie = `${SESSION_KEY}=${encodeURIComponent(json)}; path=/; max-age=86400; SameSite=Strict`;
  }

  load(): User | null {
    if (this._user) return this._user;

    const cookie = this.getCookie(SESSION_KEY);
    if (!cookie) return null;

    try {
      const parsed = JSON.parse(decodeURIComponent(cookie));
      this._user = new User(parsed as never);
      return this._user;
    } catch {
      this.destroy();
      return null;
    }
  }

  destroy(): void {
    this._user = null;
    document.cookie = `${SESSION_KEY}=; path=/; max-age=0`;
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? match[1] : null;
  }
}
