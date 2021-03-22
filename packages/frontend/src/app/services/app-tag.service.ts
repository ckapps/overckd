import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tag, TagQuery } from '@overckd/domain';
import { Page } from '@overckd/domain/dist/search';

import { UrlBuilderService } from './url-builder.service';
import { TagService } from '../modules/domain/tag/modules/tag-common/services/tag.service';
import { ApiRequestService } from '../modules/domain/api/services/api-request.service';

@Injectable({ providedIn: 'root' })
export class AppTagService implements TagService {
  constructor(
    private urlBuilder: UrlBuilderService,
    private http: HttpClient,
    private apiRequestService: ApiRequestService,
  ) {}

  findByQuery(query: TagQuery): Observable<Page<Tag>> {
    const params = this.apiRequestService.createParamsFromQuery(query);

    return this.http.get<Page<Tag>>(
      this.urlBuilder.urlFromSegments(['tags', `query`]),
      { params },
    );
  }
}
