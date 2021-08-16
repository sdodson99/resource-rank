const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test('view topic', async ({ page }) => {
  fs.writeFileSync(
    path.join(__dirname, 'mocks/mock.json'),
    JSON.stringify({
      data: {
        readOnlyModeEnabled: true,
      },
    })
  );

  await page.goto('localhost:8000');

  await page.screenshot({
    path: './screenshot.png',
  });
});
