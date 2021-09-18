const { test, expect } = require('@playwright/test');
const expectSnapshotToMatch = require('../utils/expect/snapshotToMatch');
const navigateToTopicResourceDetails = require('../utils/navigation/topic-resource-details');

test('rate topic resource', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await navigateToTopicResourceDetails(page);

  await page
    .locator('data-testid=SelectableRatingStarGroup')
    .locator('data-testid=RatingStar >> nth=0')
    .click();
  await page.click('button:has-text("Submit")');

  expect(
    await page
      .locator('data-testid=SelectableRatingStarGroup')
      .locator('data-testid=FullRatingStar')
      .count()
  ).toBe(1);

  await expectSnapshotToMatch(page, 'rate-topic-resource.png');
});
