export interface CatalogFiltersType {
  page: number;
  search?: string;
  priceFrom?: number;
  priceTo?: number;
  category?: string;
}

export interface ProductType {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
}
