import React from 'react';
import { Product } from '../models/Product';
import { ProductController } from '../controllers/ProductController';

interface CatalogPageProps {
  onOpenProduct: (id: number) => void;
  onOpenProfile: () => void;
  onLogout: () => void;
}

interface CatalogPageState {
  products: Product[];
  categories: string[];
  selectedCategory: string | null;
  loading: boolean;
  error: string;
}

export class CatalogPage extends React.Component<CatalogPageProps, CatalogPageState> {
  private productController: ProductController;

  constructor(props: CatalogPageProps) {
    super(props);
    this.productController = ProductController.getInstance();
    this.state = {
      products: [],
      categories: [],
      selectedCategory: null,
      loading: true,
      error: '',
    };
  }

  componentDidMount(): void {
    void this.loadCategories();
    void this.loadProducts(null);
  }

  private async loadCategories(): Promise<void> {
    try {
      const categories = await this.productController.getCategories();
      this.setState({ categories });
    } catch {
      this.setState({ categories: [] });
    }
  }

  private async loadProducts(category: string | null): Promise<void> {
    this.setState({ products: [], loading: true, error: '' });
    try {
      const products =
        category === null
          ? await this.productController.getCatalog()
          : await this.productController.getByCategory(category);
      this.setState({ products, loading: false });
    } catch {
      this.setState({ loading: false, error: 'No pudimos cargar los productos.' });
    }
  }

  private selectCategory(category: string | null): void {
    this.setState({ selectedCategory: category });
    void this.loadProducts(category);
  }

  render() {
    const { products, categories, selectedCategory, loading, error } = this.state;

    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-900 to-slate-800">
        <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            <h1 className="text-white font-bold text-lg">Catalogo</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => this.props.onOpenProfile()}
                className="text-slate-400 active:text-blue-400 transition-colors text-sm font-medium"
              >
                Perfil
              </button>
              <button
                onClick={() => this.props.onLogout()}
                className="text-slate-400 active:text-red-400 transition-colors text-sm font-medium"
              >
                Salir
              </button>
            </div>
          </div>
        </header>

        <nav className="sticky top-[57px] z-10 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-lg mx-auto px-4 py-2 flex gap-2 overflow-x-auto whitespace-nowrap">
            <CategoryChip
              selected={selectedCategory === null}
              label="Ver todos"
              onClick={() => this.selectCategory(null)}
            />
            {categories.map((category) => (
              <CategoryChip
                key={category}
                selected={selectedCategory === category}
                label={category.toUpperCase().replace('-', ' ')}
                onClick={() => this.selectCategory(category)}
              />
            ))}
          </div>
        </nav>

        <main className="max-w-lg mx-auto px-4 py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Spinner />
              <p className="text-slate-400 text-sm">Cargando catalogo...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-slate-300 text-sm text-center">{error}</p>
              <button
                onClick={() => void this.loadProducts(selectedCategory)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all"
              >
                Reintentar
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-slate-400 text-sm">No hay productos para mostrar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => this.props.onOpenProduct(product.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }
}

interface CategoryChipProps {
  selected: boolean;
  label: string;
  onClick: () => void;
}

function CategoryChip({ selected, label, onClick }: CategoryChipProps) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        selected
          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
          : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    >
      {label}
    </button>
  );
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/10 text-left hover:bg-white/15 transition-colors active:scale-[0.99]"
    >
      <div className="w-16 h-16 shrink-0 rounded-xl bg-black/20 overflow-hidden flex items-center justify-center">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-white text-sm font-semibold line-clamp-2">{product.title}</p>
        <p className="text-blue-400 font-bold text-base mt-1">{product.formattedPrice}</p>
        <p className="text-slate-500 text-xs mt-0.5 truncate">
          {product.category.toUpperCase().replace('-', ' ')}
        </p>
      </div>
      <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}