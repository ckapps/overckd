import { AppPaths } from './config/app-paths.types';
import { getPath } from './get-path';
import { PathId } from './path-id.enum';
import * as pathsModule from './paths';

vi.mock('./paths');

describe('paths/get-path', () => {
  const mockPaths = {
    app: 'app',
    appRoot: 'app-root',
  } as AppPaths;

  beforeEach(() => {
    vi.mocked(pathsModule.getPaths).mockReturnValue(mockPaths);
  });

  describe('getPath', () => {
    it('should return', () => {
      const result = getPath(PathId.AppAssets);
      expect(result).toBeDefined();
    });
  });
});
