const { Resource } = require('../resource');

describe('Resource', () => {
  let id;
  let name;
  let slug;
  let link;
  let dateCreated;
  let createdBy;
  let verified;

  let resource;

  beforeEach(() => {
    id = '123';
    name = 'name';
    slug = 'slug';
    link = 'link';
    dateCreated = 'dateCreated';
    createdBy = 'createdBy';
    verified = true;

    resource = new Resource(id, {
      name,
      slug,
      link,
      dateCreated,
      createdBy,
      verified,
    });
  });

  it('should expose properties', () => {
    const {
      id: actualId,
      name: actualName,
      slug: actualSlug,
      link: actualLink,
      dateCreated: actualDateCreated,
      createdBy: actualCreatedBy,
      verified: actualVerified,
    } = resource;

    expect(actualId).toBe(id);
    expect(actualName).toBe(name);
    expect(actualSlug).toBe(slug);
    expect(actualLink).toBe(link);
    expect(actualDateCreated).toBe(dateCreated);
    expect(actualCreatedBy).toBe(createdBy);
    expect(actualVerified).toBe(verified);
  });
});
