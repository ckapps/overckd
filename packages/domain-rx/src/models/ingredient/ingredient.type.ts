import { t } from '@marblejs/middleware-io';

import { dataQueryDto, flattenDataQueryDto } from '../../codecs';
import { TagUriDto } from '../tag';

// ----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------

export const IngredientDto = t.type({
  name: t.string,
});

export const IngredientSearchDto = t.partial({
  name: t.string,
  tags: t.array(TagUriDto),
});

export const IngredientByQueryDto = dataQueryDto(IngredientSearchDto);
export const FlattenIngredientByQueryDto = flattenDataQueryDto(
  IngredientSearchDto,
);

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type IngredientDto = t.TypeOf<typeof IngredientDto>;

export type IngredientByQueryDto = t.TypeOf<typeof IngredientByQueryDto>;
export type FlattenIngredientByQueryDto = t.TypeOf<
  typeof FlattenIngredientByQueryDto
>;
