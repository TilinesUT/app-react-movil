import React from 'react';
import { LoginPage } from './views/LoginPage';
import { DashboardPage } from './views/DashboardPage';
import { CatalogPage } from './views/CatalogPage';
import { ProductDetailPage } from './views/ProductDetailPage';
import { AuthController } from './controllers/AuthController';

type View = 'catalog' | 'profile' | 'detail';

interface AppState {
  isAuthenticated: boolean;
  view: View;
  selectedProductId: number | null;
}

export default class App extends React.Component<{}, AppState> {
  private authController: AuthController;

  constructor(props: {}) {
    super(props);
    this.authController = AuthController.getInstance();
    const user = this.authController.restoreSession();
    this.state = {
      isAuthenticated: user !== null,
      view: 'catalog',
      selectedProductId: null,
    };
  }

  private handleLoginSuccess(): void {
    this.setState({ isAuthenticated: true, view: 'catalog' });
  }

  private handleLogout(): void {
    this.setState({ isAuthenticated: false, view: 'catalog', selectedProductId: null });
  }

  private openProduct(id: number): void {
    this.setState({ view: 'detail', selectedProductId: id });
  }

  private openProfile(): void {
    this.setState({ view: 'profile' });
  }

  private goCatalog(): void {
    this.setState({ view: 'catalog', selectedProductId: null });
  }

  render() {
    const { isAuthenticated, view, selectedProductId } = this.state;

    if (!isAuthenticated) {
      return <LoginPage onLoginSuccess={() => this.handleLoginSuccess()} />;
    }

    if (view === 'detail' && selectedProductId !== null) {
      return (
        <ProductDetailPage
          productId={selectedProductId}
          onBack={() => this.goCatalog()}
        />
      );
    }

    if (view === 'profile') {
      return (
        <DashboardPage
          onLogout={() => this.handleLogout()}
          onBack={() => this.goCatalog()}
        />
      );
    }

    return (
      <CatalogPage
        onOpenProduct={(id) => this.openProduct(id)}
        onOpenProfile={() => this.openProfile()}
        onLogout={() => this.handleLogout()}
      />
    );
  }
}