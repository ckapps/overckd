import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Page, Tag, TagQuery } from '@overckd/domain';
import { Observable } from 'rxjs';
import { ApiRequestService } from '../modules/domain/api/services/api-request.service';
import { TagService } from '../modules/domain/tag/modules/tag-common/services/tag.service';
import { UrlBuilderService } from './url-builder.service';

@Injectable({ providedIn: 'root' })
export class AppTagService implements TagService {
  readonly #urlBuilder = inject(UrlBuilderService);
  readonly #http = inject(HttpClient);
  readonly #apiRequestService = inject(ApiRequestService);

  add(tag: Tag): Observable<Tag> {
    return this.#http.post<Tag>(
      this.#urlBuilder.urlFromSegments(['tags']),
      tag,
    );
  }

  findByQuery(query: TagQuery): Observable<Page<Tag>> {
    const params = this.#apiRequestService.createParamsFromQuery(query);

    return this.#http.get<Page<Tag>>(
      this.#urlBuilder.urlFromSegments(['tags', `query`]),
      { params },
    );
  }
}
