import { t } from '@marblejs/middleware-io';

// ----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------
export const UriDto = t.string;

export const UriIdQueryDto = t.type({
  uri: UriDto,
});

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
export type UriDto = t.TypeOf<typeof UriDto>;

export type UriIdQueryDto = t.TypeOf<typeof UriIdQueryDto>;
