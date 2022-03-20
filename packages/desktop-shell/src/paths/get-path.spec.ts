import { PathId } from './path-id.enum';
import { getPath, getPathFromSegments } from './get-path';

import * as pathsModule from './paths';

jest.mock('./paths');

describe('paths/get-path', () => {
  const mockPaths = {
    app: 'app',
    appRoot: 'app-root',
  };

  beforeEach(() => {
    // @ts-ignore
    pathsModule.getPaths.mockReturnValue(mockPaths);
  });

  describe('getPath', () => {
    it('should return', () => {
      const result = getPath(PathId.AppAssets);
      expect(result).toBeDefined();
    });
  });
});
