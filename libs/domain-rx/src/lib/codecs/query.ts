import { t } from '@marblejs/middleware-io';

import { BasePageDto } from './page';

/**
 * Creates a generic data query DTO
 *
 * @param codec Codec for the query
 *
 * @returns
 * Generic DTO for representing a data query
 */
export function dataQueryDto<T extends t.Mixed>(codec: T) {
  return t.intersection([
    t.type({
      query: codec,
    }),
    t.partial(BasePageDto.props),
  ]);
}

export function flattenDataQueryDto<T extends t.Mixed>(codec: T) {
  return t.intersection([codec, t.partial(BasePageDto.props)]);
}
