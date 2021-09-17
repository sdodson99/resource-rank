const { test, expect } = require('@playwright/test');
const expectSnapshotToMatch = require('../utils/expect/snapshotToMatch');
const navigateToTopicResourceDetails = require('../utils/navigation/topic-resource-details');

test('view topic resource', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await navigateToTopicResourceDetails(page);

  const resourceTitle = page.locator('data-testid=ResourceTitle');
  await expect(resourceTitle).toHaveText('YouTube');

  await expectSnapshotToMatch(page, 'view-topic-resource.png');
});
