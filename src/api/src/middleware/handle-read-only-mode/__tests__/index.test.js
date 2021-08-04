const handleReadOnlyMode = require('../handle-read-only-mode');
const createReadOnlyModeHandler = require('../index');

jest.mock('../handle-read-only-mode');

describe('createReadOnlyModeHandler', () => {
  let req;
  let res;
  let next;
  let readOnlyModeDataSource;

  beforeEach(() => {
    req = {};
    res = {};
    next = {};
    readOnlyModeDataSource = {};
  });

  afterEach(() => {
    handleReadOnlyMode.mockReset();
  });

  it('should return middleware that handles read only mode', async () => {
    const middleware = createReadOnlyModeHandler(readOnlyModeDataSource);
    await middleware(req, res, next);

    expect(handleReadOnlyMode).toBeCalledWith(
      req,
      res,
      next,
      readOnlyModeDataSource
    );
  });
});
