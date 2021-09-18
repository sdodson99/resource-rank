const { expect } = require('@playwright/test');

async function expectSnapshotToMatch(page, snapshotName) {
  expect(
    await page.screenshot({
      fullPage: true,
    })
  ).toMatchSnapshot(snapshotName, { threshold: 0.4 });
}

module.exports = expectSnapshotToMatch;
