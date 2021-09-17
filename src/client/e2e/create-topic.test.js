const { test, expect } = require('@playwright/test');
const expectSnapshotToMatch = require('./expect/snapshotToMatch');
const navigateToTopicListing = require('./navigation/topic-listing');

test('create topic', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await navigateToTopicListing(page);

  await page.click('a:has-text("New")');
  await page.waitForURL('**/topics/new**');

  await expectSnapshotToMatch(page, 'create-topic.png');

  await page.fill('#name', 'TypeScript');

  await page.click('button:has-text("Submit")');
  await page.waitForURL('**/topics/csharp**');

  await expectSnapshotToMatch(page, 'create-topic-success.png');

  const newTopicAlert = page.locator('data-testid=Alert');
  await expect(newTopicAlert).toHaveText('Successfully created topic.');
});
