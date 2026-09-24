export interface ProductDTO {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export class Product {
  private _id: number;
  private _title: string;
  private _price: number;
  private _description: string;
  private _category: string;
  private _image: string;
  private _rating: { rate: number; count: number };

  constructor(dto: ProductDTO) {
    this._id = dto.id;
    this._title = dto.title;
    this._price = dto.price;
    this._description = dto.description;
    this._category = dto.category;
    this._image = dto.image;
    this._rating = dto.rating ?? { rate: 0, count: 0 };
  }

  get id(): number {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get price(): number {
    return this._price;
  }

  get description(): string {
    return this._description;
  }

  get category(): string {
    return this._category;
  }

  get image(): string {
    return this._image;
  }

  get rating(): { rate: number; count: number } {
    return this._rating;
  }

  get formattedPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this._price);
  }
}