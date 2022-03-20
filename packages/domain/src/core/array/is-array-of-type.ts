type ArrayOfTypeGuard<T> = (v: unknown) => v is T[];

function arrayOfType<T>(
  v: unknown[],
  predicate: (s: unknown) => s is T,
): v is T[] {
  return v.every(v => predicate(v));
}

export function isArrayOfType<T>(
  predicate: (s: unknown) => s is T,
): ArrayOfTypeGuard<T> {
  const guard: ArrayOfTypeGuard<T> = (values: unknown): values is T[] =>
    Array.isArray(values) && arrayOfType(values, predicate);

  return guard;
}
