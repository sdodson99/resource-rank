const { Resource } = require('../../mongoose/models/resource');
const DataLoader = require('dataloader');

/**
 * Load resources in a batch.
 * @param {Array} resourceIds The resource ids to load.
 * @return {Array} The loaded resources.
 */
async function loadResources(resourceIds) {
  return await Resource.find({ _id: { $in: resourceIds } });
}

module.exports = () => new DataLoader((ids) => loadResources(ids));
