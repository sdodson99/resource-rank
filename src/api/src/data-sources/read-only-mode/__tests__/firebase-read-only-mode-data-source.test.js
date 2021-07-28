const FirebaseReadOnlyModeDataSource = require('../firebase-read-only-mode-data-source');

describe('FirebaseReadOnlyModeDataSource', () => {
  let readOnlyModeDataSource;

  let mockOn;
  let mockGet;
  let mockRef;
  let app;
  let readOnlyModeDatabasePath;
  let raiseDatabaseValueEvent;

  beforeEach(() => {
    readOnlyModeDatabasePath = 'path/to/value';
    mockOn = jest.fn();
    mockGet = jest.fn();
    mockRef = jest.fn();

    mockOn.mockImplementation((event, callback) => {
      if (event === 'value') {
        raiseDatabaseValueEvent = callback;
      }
    });
    mockRef.mockImplementation((path) => {
      if (path === readOnlyModeDatabasePath) {
        return {
          on: mockOn,
          get: mockGet,
        };
      }
    });
    app = {
      database: () => ({
        ref: mockRef,
      }),
    };

    readOnlyModeDataSource = new FirebaseReadOnlyModeDataSource(
      app,
      readOnlyModeDatabasePath
    );
  });

  describe('isReadOnlyEnabled', () => {
    it('should return loaded read only mode value if already loaded from value change', async () => {
      const expected = true;
      const event = {
        val: () => expected,
      };
      raiseDatabaseValueEvent(event);

      const actual = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(actual).toEqual(expected);
    });

    it('should return database read only mode if not already loaded', async () => {
      const expected = true;
      mockGet.mockImplementation(() => ({
        val: () => expected,
      }));

      const actual = await readOnlyModeDataSource.isReadOnlyEnabled();

      expect(actual).toEqual(expected);
    });
  });
});
