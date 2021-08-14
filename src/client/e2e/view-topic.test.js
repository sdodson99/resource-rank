const { test } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('localhost:8000');

  await page.click('data-testid=TopicsNavItem');
  await page.waitForNavigation();
});
