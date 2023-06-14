import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataQuery } from '@overckd/domain';
import * as qs from 'qs';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestService {
  constructor() {}

  createParamsFromObject(parameters: {}) {
    return this.paramsFromRecord(parameters);
  }

  createParamsFromQuery<T>(query: DataQuery<T>) {
    // Extract query parameters
    const { page, size, query: otherParams } = query;

    // Call function for creating parameters
    return this.createParamsFromObject({
      page,
      size,
      ...otherParams,
    });
  }

  private paramsFromRecord(parameters: Record<string, string>) {
    return new HttpParams({ fromString: qs.stringify(parameters) });

    // let params = new HttpParams({fromString:qs.stringify(parameters) });
    // params.

    // for (const [key, value] of Object.entries(parameters)) {
    //   if (value !== null && value !== undefined && value !== '') {
    //     params = params.append(key, value);
    //   }
    // }

    // return params;
  }
}
