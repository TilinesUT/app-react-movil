import React from 'react';
import { AuthController } from '../controllers/AuthController';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

interface LoginPageState {
  username: string;
  password: string;
  error: string;
  loading: boolean;
}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  private authController: AuthController;

  constructor(props: LoginPageProps) {
    super(props);
    this.authController = AuthController.getInstance();
    this.state = {
      username: '',
      password: '',
      error: '',
      loading: false,
    };
  }

  private async handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    this.setState({ error: '', loading: true });

    try {
      await this.authController.login(this.state.username, this.state.password);
      this.props.onLoginSuccess();
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Error al iniciar sesion',
      });
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { username, password, error, loading } = this.state;

    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-500/30 mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Bienvenido</h1>
            <p className="text-slate-400 mt-1 text-sm">Inicia sesion para continuar</p>
          </div>

          <form onSubmit={(e) => this.handleSubmit(e)} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/10">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => this.setState({ username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                placeholder="Ingresa tu usuario"
                autoComplete="username"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Contrasena
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => this.setState({ password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-base"
                placeholder="Ingresa tu contrasena"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-base shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando sesion...
                </span>
              ) : (
                'Iniciar sesion'
              )}
            </button>
          </form>

          <p className="text-slate-500 text-xs text-center mt-6">
            Credenciales: mor_2314 / 83r5^_
          </p>
        </div>
      </div>
    );
  }
}
