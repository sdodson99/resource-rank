const { test, expect } = require('@playwright/test');

test('view topic', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await page.click('data-testid=TopicsNavItem');
  await page.waitForURL('**/topics**');

  await page.click('data-testid=ListingItem >> nth=0');
  await page.waitForURL('**/topics/csharp**');

  const topicTitle = page.locator('data-testid=TopicTitle');
  const topicResourceListingItems = page.locator('data-testid=ListingItem');

  await expect(topicTitle).toHaveText('C#');
  await expect(topicResourceListingItems).toHaveCount(3);
});
