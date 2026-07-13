import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FavoritesService } from './favourites.service';

describe('FavoritesService', () => {
  let service: FavoritesService;

  beforeEach(() => {
    localStorage.clear();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    service = TestBed.inject(FavoritesService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with empty favorites', () => {
    expect(service.favorites()).toEqual([]);
  });

  it('should add favorite', () => {
    service.toggleFavorite('iPhone');

    expect(service.favorites()).toEqual(['iPhone']);
    expect(localStorage.getItem('favorites')).toEqual(JSON.stringify(['iPhone']));
  });

  it('should remove favorite', () => {
    service.toggleFavorite('iPhone');
    service.toggleFavorite('iPhone');

    expect(service.favorites()).toEqual([]);
  });

  it('should check favorite', () => {
    service.toggleFavorite('MacBook');

    expect(service.checkIsFavorite('MacBook')).toBe(true);
    expect(service.checkIsFavorite('iPhone')).toBe(false);
  });

  it('should load favorites from localStorage', () => {
    localStorage.setItem('favorites', JSON.stringify(['TV', 'Phone']));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});

    const service = TestBed.inject(FavoritesService);

    expect(service.favorites()).toEqual(['TV', 'Phone']);
  });

  it('should save to localStorage', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem');

    service.toggleFavorite('TV');

    expect(spy).toHaveBeenCalledWith('favorites', JSON.stringify(['TV']));
  });
});
