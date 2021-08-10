const handleReadOnlyMode = require('../handle-read-only-mode');
const isMutation = require('../is-mutation');

jest.mock('../is-mutation');

describe('handleReadOnlyMode', () => {
  let req;
  let res;
  let next;
  let readOnlyModeDataSource;

  beforeEach(() => {
    req = {};
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
    readOnlyModeDataSource = {
      isReadOnlyEnabled: jest.fn(),
    };
  });

  afterEach(() => {
    isMutation.mockReset();
  });

  it('should send 403 forbidden status if is mutation and in read only mode', async () => {
    isMutation.mockReturnValue(true);
    readOnlyModeDataSource.isReadOnlyEnabled.mockReturnValue(true);

    await handleReadOnlyMode(req, res, next, readOnlyModeDataSource);

    expect(res.sendStatus).toBeCalledWith(403);
  });

  it('should call next if is mutation but is not in read only mode', async () => {
    isMutation.mockReturnValue(true);

    await handleReadOnlyMode(req, res, next, readOnlyModeDataSource);

    expect(next).toBeCalledWith();
  });

  it('should call next if is is in read only mode but is not mutation', async () => {
    isMutation.mockReturnValue(false);
    readOnlyModeDataSource.isReadOnlyEnabled.mockReturnValue(true);

    await handleReadOnlyMode(req, res, next, readOnlyModeDataSource);

    expect(next).toBeCalledWith();
  });

  it('should call next if is is not in read only mode and is not mutation', async () => {
    isMutation.mockReturnValue(false);
    readOnlyModeDataSource.isReadOnlyEnabled.mockReturnValue(false);

    await handleReadOnlyMode(req, res, next, readOnlyModeDataSource);

    expect(next).toBeCalledWith();
  });
});
