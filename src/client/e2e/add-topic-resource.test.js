const { test, expect } = require('@playwright/test');
const expectSnapshotToMatch = require('./expect/snapshotToMatch');
const navigateToAddTopicResource = require('./navigation/add-topic-resource');

test('add topic resource', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}?mock=standard`);

  await navigateToAddTopicResource(page);

  await expectSnapshotToMatch(page, 'add-topic-resource.png');

  await page.click('data-testid=AddResourceButton >> nth=0');
  await page.waitForURL('**/topics/csharp/resources/youtube**');

  await expectSnapshotToMatch(page, 'add-topic-resource-success.png');

  const newTopicResourceAlert = page.locator('data-testid=Alert');
  await expect(newTopicResourceAlert).toHaveText(
    'Successfully added resource to C#.'
  );
});
