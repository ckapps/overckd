import { createComponentFactory, Spectator } from '@ngneat/spectator/vitest';
import { RecipeTipsComponent } from './recipe-tips.component';

describe('RecipeTipsComponent', () => {
  let spectator: Spectator<RecipeTipsComponent>;
  const createComponent = createComponentFactory(RecipeTipsComponent);

  it('lists the tips as HTML', () => {
    spectator = createComponent({
      props: { tips: ['Try it with <b>zucchinis</b>!', 'Add oregano'] },
    });

    expect(spectator.queryAll('li')).toHaveText([
      'Try it with zucchinis!',
      'Add oregano',
    ]);
    expect(spectator.query('li b')).toHaveText('zucchinis');
  });
});
