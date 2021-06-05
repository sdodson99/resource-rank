const RatingsMap = require('./ratings-map');

describe('RatingsMap', () => {
  let ratingsMap;

  let topicId;
  let resourceId;

  beforeEach(() => {
    ratingsMap = new RatingsMap();

    topicId = 'topic123';
    resourceId = 'resource123';
  });

  it('should return topic resource ratings when topic resource rating added', () => {
    const rating = {
      topic: topicId,
      resource: resourceId,
      value: 5,
    };
    ratingsMap.addRating(rating);

    const ratings = ratingsMap.getRatings(topicId, resourceId);

    expect(ratings).toContain(rating);
  });

  it('should return empty topic resource ratings when no topic resource ratings added', () => {
    const ratings = ratingsMap.getRatings(topicId, resourceId);

    expect(ratings).toHaveLength(0);
  });

  it('should return multiple topic resource ratings when multiple topic resource ratings added', () => {
    const rating1 = {
      topic: topicId,
      resource: resourceId,
      value: 5,
    };
    const rating2 = {
      topic: topicId,
      resource: resourceId,
      value: 1,
    };
    ratingsMap.addRating(rating1);
    ratingsMap.addRating(rating2);

    const ratings = ratingsMap.getRatings(topicId, resourceId);

    expect(ratings).toContain(rating1);
    expect(ratings).toContain(rating2);
  });
});
