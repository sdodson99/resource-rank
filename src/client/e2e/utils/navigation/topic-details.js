const navigateToTopicListing = require('./topic-listing');

async function navigateToTopicDetails(page) {
  await navigateToTopicListing(page);

  await page.click('data-testid=ListingItem >> nth=0');
  await page.waitForURL('**/topics/csharp**');
}

module.exports = navigateToTopicDetails;
