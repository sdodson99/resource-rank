async function navigateToTopicListing(page) {
  await page.click('data-testid=TopicsNavItem');
  await page.waitForURL('**/topics**');
}

module.exports = navigateToTopicListing;
