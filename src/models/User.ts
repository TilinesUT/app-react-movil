import { Role } from './Role';

interface UserAddress {
  city: string;
  street: string;
  number: number;
  zipcode: string;
  geolocation: {
    lat: string;
    long: string;
  };
}

interface UserName {
  firstname: string;
  lastname: string;
}

export interface UserDTO {
  id: number;
  email: string;
  username: string;
  password: string;
  name: UserName;
  address: UserAddress;
  phone: string;
}

export class User {
  private _id: number;
  private _email: string;
  private _username: string;
  private _name: UserName;
  private _address: UserAddress;
  private _phone: string;
  private _role: Role;

  constructor(dto: UserDTO) {
    this._id = dto.id;
    this._email = dto.email;
    this._username = dto.username;
    this._name = dto.name;
    this._address = dto.address;
    this._phone = dto.phone;
    this._role = this.resolveRole(dto.id);
  }

  private resolveRole(id: number): Role {
    if (id === 1 || id === 2) return Role.ADMIN;
    if (id === 3) return Role.AUDITOR;
    return Role.CLIENT;
  }

  get id(): number {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get username(): string {
    return this._username;
  }

  get name(): UserName {
    return this._name;
  }

  get address(): UserAddress {
    return this._address;
  }

  get phone(): string {
    return this._phone;
  }

  get role(): Role {
    return this._role;
  }

  get fullName(): string {
    return `${this._name.firstname} ${this._name.lastname}`;
  }

  get fullAddress(): string {
    return `${this._address.street} ${this._address.number}, ${this._address.city} (${this._address.zipcode})`;
  }

  get isAdmin(): boolean {
    return this._role === Role.ADMIN;
  }

  get isAuditor(): boolean {
    return this._role === Role.AUDITOR;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      email: this._email,
      username: this._username,
      name: this._name,
      address: this._address,
      phone: this._phone,
      role: this._role,
    };
  }
}
