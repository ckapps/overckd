import { ApplicationRef, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Context, Effect, Layer, Schema } from 'effect';
import { describe, expect, it, vi } from 'vitest';
import {
  injectCommands,
  injectQueries,
  provideEffectRuntime,
} from './angular-effect';

interface Note {
  readonly id: string;
  readonly text: string;
}

interface NoteFindByIdPayload {
  readonly id: string;
}

interface NoteEditPayload {
  readonly id: string;
  readonly text: string;
}

class NoteNotFound extends Schema.TaggedError<NoteNotFound>()('NoteNotFound', {
  id: Schema.String,
}) {}

class NoteQueries extends Context.Service<
  NoteQueries,
  {
    readonly getAll: Effect.Effect<ReadonlyArray<Note>>;
    readonly findById: (
      payload: NoteFindByIdPayload,
    ) => Effect.Effect<Note, NoteNotFound>;
  }
>()('NoteQueries') {}

class NoteCommands extends Context.Service<
  NoteCommands,
  {
    readonly edit: (
      payload: NoteEditPayload,
    ) => Effect.Effect<Note, NoteNotFound>;
  }
>()('NoteCommands') {}

const groceries: Note = { id: 'groceries', text: 'Milk' };
const chores: Note = { id: 'chores', text: 'Dishes' };
const notes = [groceries, chores];

const findNote = ({ id }: NoteFindByIdPayload) => {
  const note = notes.find(note => note.id === id);
  return note ? Effect.succeed(note) : Effect.fail(new NoteNotFound({ id }));
};

const setup = <R>(layer: Layer.Layer<R>) =>
  TestBed.configureTestingModule({ providers: [provideEffectRuntime(layer)] });

const stable = () => TestBed.inject(ApplicationRef).whenStable();

describe('injectQueries', () => {
  const setupNotes = () =>
    setup(
      Layer.mock(NoteQueries, {
        getAll: Effect.succeed(notes),
        findById: findNote,
      }),
    );

  it('loads an effect member without arguments', async () => {
    setupNotes();
    const all = TestBed.runInInjectionContext(() =>
      injectQueries(NoteQueries).getAll(),
    );
    await stable();
    expect(all.value()).toEqual(notes);
  });

  it('stays idle while an input is undefined, then loads', async () => {
    setupNotes();
    const payload = signal<NoteFindByIdPayload | undefined>(undefined);
    const note = TestBed.runInInjectionContext(() =>
      injectQueries(NoteQueries).findById(payload),
    );
    await stable();
    expect(note.status()).toBe('idle');

    payload.set({ id: groceries.id });
    await stable();
    expect(note.value()).toEqual(groceries);
  });

  it('loads again when an input changes', async () => {
    setupNotes();
    const payload = signal<NoteFindByIdPayload | undefined>({
      id: groceries.id,
    });
    const note = TestBed.runInInjectionContext(() =>
      injectQueries(NoteQueries).findById(payload),
    );
    await stable();
    expect(note.value()).toEqual(groceries);

    payload.set({ id: chores.id });
    await stable();
    expect(note.value()).toEqual(chores);
  });

  it('shows the typed error as the resource error', async () => {
    setupNotes();
    const note = TestBed.runInInjectionContext(() =>
      injectQueries(NoteQueries).findById(signal({ id: 'nope' })),
    );
    await stable();
    expect(note.status()).toBe('error');
    expect(note.error()).toBeInstanceOf(NoteNotFound);
  });

  it('interrupts the running effect when an input changes', async () => {
    const started: Array<string> = [];
    const interrupted: Array<string> = [];
    setup(
      Layer.mock(NoteQueries, {
        findById: ({ id }) =>
          id === 'slow'
            ? Effect.sync(() => void started.push(id)).pipe(
                Effect.andThen(Effect.never),
                Effect.onInterrupt(() =>
                  Effect.sync(() => void interrupted.push(id)),
                ),
              )
            : findNote({ id }),
      }),
    );
    const payload = signal<NoteFindByIdPayload | undefined>({ id: 'slow' });
    const note = TestBed.runInInjectionContext(() =>
      injectQueries(NoteQueries).findById(payload),
    );
    TestBed.tick();
    await vi.waitFor(() => expect(started).toEqual(['slow']));

    payload.set({ id: groceries.id });
    await stable();
    expect(note.value()).toEqual(groceries);
    await vi.waitFor(() => expect(interrupted).toEqual(['slow']));
  });
});

describe('injectCommands', () => {
  const failure = new Error('disk full');

  const setupNotes = () =>
    setup(
      Layer.mock(NoteCommands, {
        edit: ({ id, text }) =>
          id === 'broken'
            ? Effect.die(failure)
            : Effect.map(findNote({ id }), note => ({ ...note, text })),
      }),
    );

  it('resolves with the value of the effect', async () => {
    setupNotes();
    const commands = TestBed.runInInjectionContext(() =>
      injectCommands(NoteCommands),
    );
    await expect(
      commands.edit({ id: groceries.id, text: 'Bread' }),
    ).resolves.toEqual({ id: groceries.id, text: 'Bread' });
  });

  it('rejects with the typed error', async () => {
    setupNotes();
    const commands = TestBed.runInInjectionContext(() =>
      injectCommands(NoteCommands),
    );
    await expect(
      commands.edit({ id: 'nope', text: 'Bread' }),
    ).rejects.toBeInstanceOf(NoteNotFound);
  });

  it('rejects with the defect', async () => {
    setupNotes();
    const commands = TestBed.runInInjectionContext(() =>
      injectCommands(NoteCommands),
    );
    await expect(commands.edit({ id: 'broken', text: 'Bread' })).rejects.toBe(
      failure,
    );
  });
});

describe('provideEffectRuntime', () => {
  it('builds the layer once and releases it with the app', async () => {
    const events: Array<string> = [];
    setup(
      Layer.effect(
        NoteQueries,
        Effect.acquireRelease(
          Effect.sync(() => {
            events.push('acquire');
            return NoteQueries.of({
              getAll: Effect.succeed(notes),
              findById: findNote,
            });
          }),
          () => Effect.sync(() => void events.push('release')),
        ),
      ),
    );
    const [all, note] = TestBed.runInInjectionContext(() => {
      const queries = injectQueries(NoteQueries);
      return [queries.getAll(), queries.findById(signal({ id: chores.id }))];
    });
    await stable();
    expect(all.value()).toEqual(notes);
    expect(note.value()).toEqual(chores);
    expect(events).toEqual(['acquire']);

    TestBed.resetTestingModule();
    await vi.waitFor(() => expect(events).toEqual(['acquire', 'release']));
  });
});
