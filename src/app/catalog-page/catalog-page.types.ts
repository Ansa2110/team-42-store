export type CatalogFiltersType = {
  page: number;
  search?: string;
  priceFrom?: number;
  priceTo?: number;
  category?: string;
};

export type ProductType = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
};
