import { t } from '@marblejs/middleware-io';

import { dataQueryDto, flattenDataQueryDto } from '../../codecs';

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

export const TagDto = tagDto();

export const TagSearchDto = t.partial({
  label: t.string,
});

export const TagByQueryDto = dataQueryDto(TagSearchDto);
export const FlattenTagByQueryDto = flattenDataQueryDto(TagSearchDto);

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
export type TagDto = t.TypeOf<typeof TagDto>;

export type TagByQueryDto = t.TypeOf<typeof TagByQueryDto>;
export type FlattenTagByQueryDto = t.TypeOf<typeof FlattenTagByQueryDto>;
