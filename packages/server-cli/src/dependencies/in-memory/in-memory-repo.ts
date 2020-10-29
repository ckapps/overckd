export abstract class InMemoryRepo<T> {
  protected all: T[] = [];

  _add(item: T) {
    this.all.push(item);
  }

  _remove(item: T) {
    const lengthBefore = this.all.length;
    this.all = this.all.filter(i => !this.equals(i, item));

    return this.all.length !== lengthBefore;
  }

  abstract equals(a: T, b: T): boolean;
}
