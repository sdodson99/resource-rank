const navigateToTopicDetails = require('./topic-details');

async function navigateToTopicResourceDetails(page) {
  await navigateToTopicDetails(page);

  await page.click('data-testid=ListingItem >> nth=0');
  await page.waitForURL('**/topics/csharp/resources/youtube**');
}

module.exports = navigateToTopicResourceDetails;
