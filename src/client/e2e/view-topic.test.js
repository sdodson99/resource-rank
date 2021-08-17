const { expect } = require('@playwright/test');
const test = require('./fixtures/mock-api');

test('view topic', async ({ page, mockApi }) => {
  await page.goto('localhost:8000');

  mockApi.mockResolver('topics', [
    {
      id: 'topic1',
      name: 'Topic 1',
      slug: 'topic-1',
    },
    {
      id: 'topic2',
      name: 'Topic 2',
      slug: 'topic-2',
    },
    {
      id: 'topic3',
      name: 'Topic 3',
      slug: 'topic-3',
    },
  ]);
  await page.click('data-testid=TopicsNavItem');
  await page.waitForURL('**/topics');

  mockApi.mockResolver('topicBySlug', {
    id: 'topic1',
    name: 'Topic 1',
    slug: 'topic-1',
  });
  mockApi.mockResolver('topicResourceList', {
    topicResources: [
      {
        resource: {
          id: 'resource1',
          name: 'Resource 1',
          slug: 'resource-1',
        },
        ratingList: {
          average: 1,
        },
      },
      {
        resource: {
          id: 'resource2',
          name: 'Resource 2',
          slug: 'resource-2',
        },
        ratingList: {
          average: 5,
        },
      },
    ],
  });
  await page.click('data-testid=ListingItem >> nth=0');
  await page.waitForURL('**/topics/topic-1');

  const topicTitle = page.locator('data-testid=TopicTitle');
  const topicResourceListingItems = page.locator('data-testid=ListingItem');

  await expect(topicTitle).toHaveText('Topic 1');
  await expect(topicResourceListingItems).toHaveCount(2);
});
