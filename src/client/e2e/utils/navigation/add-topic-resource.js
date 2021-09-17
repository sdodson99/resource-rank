const navigateToTopicDetails = require('./topic-details');

async function navigateToAddTopicResource(page) {
  await navigateToTopicDetails(page);

  await page.click('a:has-text("Add")');
  await page.waitForURL('**/topics/csharp/resources/add**');
}

module.exports = navigateToAddTopicResource;
