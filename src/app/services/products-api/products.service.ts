import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { makeHttpParams } from '@shared/utils';
import { ICategory, IProductsResponse, ProductsFilters } from './products.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);
  private baseUrl = 'https://dummyjson.com';

  // GET: Получение данных
  getProducts(filters?: ProductsFilters): Observable<IProductsResponse> {
    return this.http.get<IProductsResponse>(`${this.baseUrl}/products`, {
      params: makeHttpParams(filters),
    });
  }

  getProductById(id: string) {
    return this.http.get(`${this.baseUrl}/products/${id}`);
  }
  //todo fix
  searchProduct(filters: ProductsFilters) {
    return this.http.get(`${this.baseUrl}/products/search`, {
      params: makeHttpParams(filters),
    });
  }

  getAllCategories(filters?: ProductsFilters): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(`${this.baseUrl}/products/categories`, {
      params: makeHttpParams(filters),
    });
  }
  getProductsCategoryList(filters?: ProductsFilters): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/products/category-list`, {
      params: makeHttpParams(filters),
    });
  }
  getProductsByCategory(filters?: ProductsFilters) {
    return this.http.get(`${this.baseUrl}/products/category/smartphones`, {
      params: makeHttpParams(filters),
    });
  }
}
