import { t } from '@marblejs/middleware-io';

export const BasePageDto = t.type({
  page: t.number,
  size: t.number,
});

export const PageInformationDto = t.intersection([
  BasePageDto,
  t.type({
    count: t.number,
  }),
  t.partial({
    next: t.string,
    prev: t.string,
  }),
]);

export function PageDto<T extends t.Mixed>(codec: T) {
  return t.intersection([
    PageInformationDto,
    t.type({
      result: t.array(codec),
    }),
  ]);
}
