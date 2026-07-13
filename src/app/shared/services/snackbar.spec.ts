import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { describe, beforeEach, it, expect, vi } from 'vitest';

import { SnackBarService } from './snackbar.service';

describe('SnackBarService', () => {
  let service: SnackBarService;

  const snackBarMock = {
    open: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        SnackBarService,
        {
          provide: MatSnackBar,
          useValue: snackBarMock,
        },
      ],
    });

    service = TestBed.inject(SnackBarService);
  });

  it('should open error snackbar', () => {
    service.error('Error');

    expect(snackBarMock.open).toHaveBeenCalledWith('Error', undefined, {
      panelClass: 'error',
      duration: 10000,
    });
  });

  it('should open success snackbar', () => {
    service.success('Success');

    expect(snackBarMock.open).toHaveBeenCalledWith('Success', undefined, {
      panelClass: 'success',
      duration: 7000,
    });
  });
});
