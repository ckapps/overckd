import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UrlBuilderService {
  private readonly baseUrl = environment.apiUrl;

  constructor() {}

  url(suffix: string) {
    const url = `${this.baseUrl}/${suffix}`;
    console.log('request url:', url);
    return url;
  }
}
