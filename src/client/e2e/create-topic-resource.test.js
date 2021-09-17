const { test, expect } = require('@playwright/test');
const expectSnapshotToMatch = require('./expect/snapshotToMatch');
const navigateToAddTopicResource = require('./navigation/add-topic-resource');

test('create topic resource', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await navigateToAddTopicResource(page);

  await page.click('a:has-text("New")');
  await page.waitForURL('**/topics/csharp/resources/new**');

  await expectSnapshotToMatch(page, 'create-topic-resource.png');

  await page.fill('#name', 'TypeScript Docs');
  await page.fill('#link', 'typescript.com');

  await page.click('button:has-text("Submit")');
  await page.waitForURL('**/topics/csharp/resources/youtube**');

  await expectSnapshotToMatch(page, 'create-topic-resource-success.png');

  const newTopicResourceAlert = page.locator('data-testid=Alert');
  await expect(newTopicResourceAlert).toHaveText(
    'Successfully added resource to C#.'
  );
});
