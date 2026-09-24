import React from 'react';
import { Product } from '../models/Product';
import { AuthController } from '../controllers/AuthController';
import { ProductController } from '../controllers/ProductController';

interface ProductDetailPageProps {
  productId: number;
  onBack: () => void;
}

interface ProductDetailPageState {
  product: Product | null;
  loading: boolean;
  unavailable: boolean;
  editing: boolean;
  title: string;
  price: string;
  category: string;
  description: string;
  saving: boolean;
  editError: string;
}

export class ProductDetailPage extends React.Component<ProductDetailPageProps, ProductDetailPageState> {
  private productController: ProductController;
  private isAdmin: boolean;

  constructor(props: ProductDetailPageProps) {
    super(props);
    this.productController = ProductController.getInstance();
    this.isAdmin = AuthController.getInstance().currentUser?.isAdmin ?? false;
    this.state = {
      product: null,
      loading: true,
      unavailable: false,
      editing: false,
      title: '',
      price: '',
      category: '',
      description: '',
      saving: false,
      editError: '',
    };
  }

  componentDidMount(): void {
    void this.loadDetail();
  }

  private async loadDetail(): Promise<void> {
    this.setState({ loading: true, unavailable: false });
    try {
      const product = await this.productController.getDetail(this.props.productId);
      this.setState({ product, loading: false });
    } catch {
      this.setState({ loading: false, unavailable: true, product: null });
    }
  }

  private startEdit(): void {
    const { product } = this.state;
    if (!product) return;
    this.setState({
      editing: true,
      title: product.title,
      price: String(product.price),
      category: product.category,
      description: product.description,
      editError: '',
    });
  }

  private cancelEdit(): void {
    this.setState({ editing: false });
  }

  private async saveEdit(): Promise<void> {
    const { title, price, category, description } = this.state;

    if (!title.trim() || !price.trim() || !category.trim()) {
      this.setState({ editError: 'Titulo, precio y categoria son obligatorios.' });
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      this.setState({ editError: 'El precio debe ser un numero valido.' });
      return;
    }

    this.setState({ saving: true });
    try {
      const image = this.state.product?.image ?? '';
      const updated = await this.productController.update(this.props.productId, {
        title: title.trim(),
        price: numericPrice,
        description,
        category: category.trim(),
        image,
      }, this.state.product?.rating);
      this.setState({ product: updated, editing: false, saving: false });
      window.alert('Producto actualizado');
    } catch {
      this.setState({ saving: false, editError: 'No se pudo actualizar el producto.' });
    }
  }

  private async handleDelete(): Promise<void> {
    const confirmed = window.confirm(
      'Esta accion no se puede deshacer. Deseas continuar?'
    );
    if (!confirmed) return;

    try {
      await this.productController.remove(this.props.productId);
      window.alert('Producto eliminado');
      this.props.onBack();
    } catch {
      window.alert('No se pudo eliminar el producto');
    }
  }

  render() {
    const { product, loading, unavailable } = this.state;

    return (
      <div className="min-h-dvh bg-gradient-to-br from-slate-900 to-slate-800">
        <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
            <button
              onClick={() => this.props.onBack()}
              className="flex items-center gap-1 text-slate-300 active:text-blue-400 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <h1 className="text-white font-bold text-lg">Detalle</h1>
            <span className="w-12" />
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-4">
          {unavailable ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <h2 className="text-white font-bold text-lg">Producto no disponible</h2>
              <p className="text-slate-400 text-sm text-center">
                No se pudo cargar el detalle del producto.
              </p>
              <button
                onClick={() => this.props.onBack()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all"
              >
                Volver al catalogo
              </button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <Spinner />
              <p className="text-slate-400 text-sm">Cargando producto...</p>
            </div>
          ) : product === null ? null : this.state.editing ? (
            this.renderEditForm()
          ) : (
            this.renderDetail(product)
          )}
        </main>
      </div>
    );
  }

  private renderDetail(product: Product): React.ReactNode {
    const rating = product.rating;
    const ratingText =
      rating.count > 0
        ? `${rating.rate.toFixed(1)} (${rating.count} resenas)`
        : 'Sin resenas';

    return (
      <div className="space-y-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
          <div className="h-60 rounded-xl bg-black/20 overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 space-y-3">
          <h2 className="text-white text-xl font-bold">{product.title}</h2>

          <div className="flex items-center justify-between">
            <p className="text-blue-400 font-bold text-2xl">{product.formattedPrice}</p>
            <span className="px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
              {product.category.toUpperCase().replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-slate-400 text-sm">{ratingText}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10">
          <h3 className="text-slate-300 text-sm font-semibold mb-3 uppercase tracking-wider">
            Descripcion
          </h3>
          <p className="text-slate-300 text-sm leading-relaxed">{product.description}</p>
        </div>

        {this.isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={() => this.startEdit()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all"
            >
              Editar
            </button>
            <button
              onClick={() => void this.handleDelete()}
              className="flex-1 py-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 font-semibold text-sm active:scale-[0.98] transition-all"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    );
  }

  private renderEditForm(): React.ReactNode {
    const { title, price, category, description, saving, editError } = this.state;

    const inputClass =
      'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-base';

    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/10 space-y-3">
        <h2 className="text-white text-lg font-bold">Editar producto</h2>

        {editError && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm text-center">
            {editError}
          </div>
        )}

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => this.setState({ title: e.target.value })}
            className={inputClass}
            placeholder="Titulo del producto"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Precio</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => this.setState({ price: e.target.value })}
            className={inputClass}
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Categoria</label>
          <input
            type="text"
            value={category}
            onChange={(e) => this.setState({ category: e.target.value })}
            className={inputClass}
            placeholder="electronics"
          />
        </div>

        <div>
          <label className="block text-slate-300 text-sm font-medium mb-2">Descripcion</label>
          <textarea
            value={description}
            onChange={(e) => this.setState({ description: e.target.value })}
            rows={4}
            className={inputClass}
            placeholder="Descripcion del producto"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => this.cancelEdit()}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm border border-white/10 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => void this.saveEdit()}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/30 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    );
  }
}

function Spinner() {
  return (
    <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}