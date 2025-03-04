import { getPath } from './get-path';
import { PathId } from './path-id.enum';
import * as pathsModule from './paths';

jest.mock('./paths');

describe('paths/get-path', () => {
  const mockPaths = {
    app: 'app',
    appRoot: 'app-root',
  };

  beforeEach(() => {
    // @ts-expect-error importing a mocked version
    pathsModule.getPaths.mockReturnValue(mockPaths);
  });

  describe('getPath', () => {
    it('should return', () => {
      const result = getPath(PathId.AppAssets);
      expect(result).toBeDefined();
    });
  });
});
