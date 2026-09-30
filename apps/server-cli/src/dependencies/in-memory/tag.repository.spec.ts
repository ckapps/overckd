import { TagRepository } from '@overckd/domain';

import { MockTagRespository } from './tag.repository';

describe('MockTagRespository', () => {
  let repo: TagRepository;

  beforeEach(() => {
    repo = MockTagRespository(new Map());
  });

  it('should create', () => {
    expect(repo).toBeDefined();
  });
});
