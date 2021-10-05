const slugify = require('..');
const slug = require('slugify');

jest.mock('slugify');

describe('slugify', () => {
  beforeEach(() => {
    slug.mockReset();
  });

  it('should return slugified value', () => {
    slug.mockReturnValue('some-random-string');
    const expected = 'some-random-string';

    const actual = slugify('some random string');

    expect(actual).toBe(expected);
  });

  it('should convert "#" to "sharp" in charmap', () => {
    expect(slug.extend).toBeCalledWith({ '#': 'sharp' });
  });

  it('should convert to lower case', () => {
    slugify('some random string');

    expect(slug.mock.calls[0][1]).toEqual({ lower: true });
  });
});
