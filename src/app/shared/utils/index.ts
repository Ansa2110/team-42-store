import { HttpParams } from '@angular/common/http';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeHttpParams = (obj?: Record<string, any>) => {
  let params: HttpParams = new HttpParams();
  if (obj) {
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((valueItem) => {
          params = params.append(key, valueItem);
        });
      } else if (typeof value !== 'undefined' && value !== null) {
        params = params.append(key, value);
      }
    });
  }
  return params;
};
