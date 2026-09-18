import React from 'react';
import { User } from '../models/User';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';

interface DashboardPageProps {
  onLogout: () => void;
}

interface DashboardPageState {
  user: User | null;
}

export class DashboardPage extends React.Component<DashboardPageProps, DashboardPageState> {
  private authController: AuthController;
  private userController: UserController;

  constructor(props: DashboardPageProps) {
    super(props);
    this.authController = AuthController.getInstance();
    this.userController = UserController.getInstance();
    this.state = {
      user: this.authController.currentUser,
    };
  }

  private handleLogout(): void {
    this.authController.logout();
    this.props.onLogout();
  }

  render() {
    const { user } = this.state;

    if (!user) return null;

    const roleLabel = this.userController.getRoleLabel(user.role);
    const roleColor = this.userController.getRoleColor(user.role);

    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-900 to-slate-800">
        <header className="sticky top-0 z-10 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            <h1 className="text-white font-bold text-lg">Mi Perfil</h1>
            <button
              onClick={this.handleLogout}
              className="text-slate-400 active:text-red-400 transition-colors text-sm font-medium"
            >
              Salir
            </button>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
              <span className="text-3xl font-bold text-white">
                {user.name.firstname.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
            <p className="text-slate-400 text-sm mt-1">@{user.username}</p>
            <div className="mt-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
            <h3 className="text-slate-300 text-sm font-semibold mb-4 uppercase tracking-wider">
              Informacion Personal
            </h3>
            <div className="space-y-3">
              <InfoRow icon="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" label="Email" value={user.email} />
              <InfoRow icon="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" label="Telefono" value={user.phone} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
            <h3 className="text-slate-300 text-sm font-semibold mb-4 uppercase tracking-wider">
              Direccion
            </h3>
            <div className="space-y-3">
              <InfoRow icon="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" label="Calle" value={`${user.address.street} ${user.address.number}`} />
              <InfoRow icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" label="Ciudad" value={user.address.city} />
              <InfoRow icon="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" label="Codigo Postal" value={user.address.zipcode} />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
            <h3 className="text-slate-300 text-sm font-semibold mb-4 uppercase tracking-wider">
              Geolocalizacion
            </h3>
            <div className="space-y-3">
              <InfoRow icon="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" label="Latitud" value={user.address.geolocation.lat} />
              <InfoRow icon="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" label="Longitud" value={user.address.geolocation.long} />
            </div>
          </div>
        </main>
      </div>
    );
  }
}

class InfoRow extends React.Component<{ icon: string; label: string; value: string }> {
  render() {
    const { icon, label, value } = this.props;
    return (
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
        <div className="min-w-0">
          <p className="text-slate-500 text-xs">{label}</p>
          <p className="text-white text-sm font-medium truncate">{value}</p>
        </div>
      </div>
    );
  }
}
