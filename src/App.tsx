import React from 'react';
import { LoginPage } from './views/LoginPage';
import { DashboardPage } from './views/DashboardPage';
import { AuthController } from './controllers/AuthController';

interface AppState {
  isAuthenticated: boolean;
}

export default class App extends React.Component<{}, AppState> {
  private authController: AuthController;

  constructor(props: {}) {
    super(props);
    this.authController = AuthController.getInstance();
    this.state = {
      isAuthenticated: false,
    };
  }

  componentDidMount(): void {
    const user = this.authController.restoreSession();
    if (user) {
      this.setState({ isAuthenticated: true });
    }
  }

  private handleLoginSuccess(): void {
    this.setState({ isAuthenticated: true });
  }

  private handleLogout(): void {
    this.setState({ isAuthenticated: false });
  }

  render() {
    if (this.state.isAuthenticated) {
      return <DashboardPage onLogout={() => this.handleLogout()} />;
    }

    return <LoginPage onLoginSuccess={() => this.handleLoginSuccess()} />;
  }
}
