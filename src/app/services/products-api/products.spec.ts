import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';

import { ProductsService } from './products.service';
import { ICategory } from './products.types';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const BASE_URL = 'https://dummyjson.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductsService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get products', () => {
    const response = {
      products: [],
      total: 0,
      skip: 0,
      limit: 30,
    };

    service.getProducts().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${BASE_URL}/products`);

    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('should get product by id', () => {
    const response = { id: 1 };

    service.getProductById('1').subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${BASE_URL}/products/1`);

    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('should search product', () => {
    service.searchProduct({ q: 'iphone' }).subscribe();

    const req = httpMock.expectOne((request) => {
      return request.url === `${BASE_URL}/products/search` && request.params.get('q') === 'iphone';
    });

    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should get categories', () => {
    const response: ICategory[] = [];

    service.getAllCategories().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${BASE_URL}/products/categories`);

    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('should get category list', () => {
    const response = ['phones', 'laptops'];

    service.getProductsCategoryList().subscribe((res) => {
      expect(res).toEqual(response);
    });

    const req = httpMock.expectOne(`${BASE_URL}/products/category-list`);

    expect(req.request.method).toBe('GET');

    req.flush(response);
  });

  it('should get products by category', () => {
    service.getProductsByCategory().subscribe();

    const req = httpMock.expectOne(`${BASE_URL}/products/category/smartphones`);

    expect(req.request.method).toBe('GET');

    req.flush({});
  });

  it('should pass query params', () => {
    service
      .getProducts({
        limit: 10,
        skip: 5,
      })
      .subscribe();

    const req = httpMock.expectOne((request) => {
      return (
        request.url === `${BASE_URL}/products` &&
        request.params.get('limit') === '10' &&
        request.params.get('skip') === '5'
      );
    });

    expect(req.request.method).toBe('GET');

    req.flush({
      products: [],
      total: 0,
      skip: 5,
      limit: 10,
    });
  });
});
