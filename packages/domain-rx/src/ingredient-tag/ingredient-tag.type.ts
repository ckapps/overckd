import { t } from '@marblejs/middleware-io';

import { dataQueryDto, flattenDataQueryDto } from '../codecs';
import { tagDto } from '../tag';

// ----------------------------------------------------------------------------
// Consts
// ----------------------------------------------------------------------------

export const IngredientTagDto = tagDto();

export const IngredientTagSearchDto = t.partial({
  label: t.string,
});

export const IngredientTagByQueryDto = dataQueryDto(IngredientTagSearchDto);
export const FlattenIngredientTagByQueryDto = flattenDataQueryDto(
  IngredientTagSearchDto,
);

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export type IngredientTagDto = t.TypeOf<typeof IngredientTagDto>;

export type IngredientTagByQueryDto = t.TypeOf<typeof IngredientTagByQueryDto>;
export type FlattenIngredientTagByQueryDto = t.TypeOf<
  typeof FlattenIngredientTagByQueryDto
>;
