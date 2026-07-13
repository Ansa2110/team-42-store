export interface ProductsFilters {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: string;
  q?: string
}

export interface ICategory {
  slug: string;
  name: string;
  url: string;
}

export interface IProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface IProductReview {
  rating: number;
  comment: string;
  date: string; // Строка в формате ISO (например, "2024-05-23T...")
  reviewerName: string;
  reviewerEmail: string;
}

export interface IProductMeta {
  createdAt: string; // Строка в формате ISO
  updatedAt: string; // Строка в формате ISO
  barcode: string;
  qrCode: string;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: IProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: IProductMeta;
  thumbnail: string;
  images: string[];
}

export interface IProductsResponse {
  products: IProduct[];
  total?: number;
  skip?: number;
  limit?: number;
}
export interface TCategory {
  slug: string;
  name: string;
  url: string;
}
