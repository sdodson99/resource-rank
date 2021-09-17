const { expect } = require('@playwright/test');

async function expectSnapshotToMatch(page, snapshotName) {
  expect(
    await page.screenshot({
      fullPage: true,
    })
  ).toMatchSnapshot(snapshotName, { threshold: 0.2 });
}

module.exports = expectSnapshotToMatch;
