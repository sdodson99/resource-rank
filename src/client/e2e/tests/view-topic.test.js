const { test, expect } = require('@playwright/test');
const expectSnapshotToMatch = require('../utils/expect/snapshotToMatch');
const navigateToTopicDetails = require('../utils/navigation/topic-details');

test('view topic', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await navigateToTopicDetails(page);

  const topicTitle = page.locator('data-testid=TopicTitle');
  const topicResourceListingItems = page.locator('data-testid=ListingItem');

  await expect(topicTitle).toHaveText('C#');
  await expect(topicResourceListingItems).toHaveCount(3);

  await expectSnapshotToMatch(page, 'view-topic.png');
});
