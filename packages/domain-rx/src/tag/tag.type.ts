import { t } from '@marblejs/middleware-io';

// ----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------

const BaseTagIconDto = t.string;

export const TagUriDto = t.string;

export const BaseTagDto = t.intersection([
  t.type({
    uri: TagUriDto,
    label: t.string,
  }),
  t.partial({
    color: t.string,
    icon: BaseTagIconDto,
  }),
]);

export function tagDto() {
  return BaseTagDto;
}
// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type TagDto = t.TypeOf<typeof BaseTagDto>;
