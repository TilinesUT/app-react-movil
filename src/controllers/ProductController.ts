import { Product } from '../models/Product';
import { ApiService } from '../services/ApiService';

export interface ProductUpdatePayload {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export class ProductController {
  private static instance: ProductController;
  private api: ApiService;

  private constructor() {
    this.api = ApiService.getInstance();
  }

  static getInstance(): ProductController {
    if (!ProductController.instance) {
      ProductController.instance = new ProductController();
    }
    return ProductController.instance;
  }

  async getCatalog(): Promise<Product[]> {
    const dtos = await this.api.getProducts();
    return dtos.map((dto) => new Product(dto));
  }

  async getCategories(): Promise<string[]> {
    return this.api.getCategories();
  }

  async getByCategory(category: string): Promise<Product[]> {
    const dtos = await this.api.getProductsByCategory(category);
    return dtos.map((dto) => new Product(dto));
  }

  async getDetail(id: number): Promise<Product> {
    const dto = await this.api.getProduct(id);
    return new Product(dto);
  }

  async remove(id: number): Promise<void> {
    return this.api.deleteProduct(id);
  }

  async update(
    id: number,
    values: ProductUpdatePayload,
    previousRating?: Product['rating'],
  ): Promise<Product> {
    const dto = await this.api.updateProduct(id, values);
    return new Product({ ...dto, rating: dto.rating ?? previousRating });
  }
}